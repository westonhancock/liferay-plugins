AUI().use(
	'anim-base',
	'anim-easing',
	'aui-base',
	'liferay-poller',
	function(A) {
		Liferay.namespace('Chat');

		var TPL_CHAT_PANEL = '<li class="user user_{panelId}" panelId="{panelId}">' +
				'<div class="panel-trigger">' +
					'<span class="trigger-name"></span>' +
					'<div class="typing-status"></div>' +
				'</div>' +
				'<div class="chat-panel">' +
					'<div class="remote-video-container hide">' +
						'<div class="remote-video">' +
							'<video autoplay="autoplay" class="remote"></video>' +
						'</div>' +
					'</div>' +
					'<div class="panel-window">' +
						'<div class="panel-button minimize"></div>' +
						'<div class="panel-button close"></div>' +
						'<div class="panel-self-view">' +
							'<img alt="{panelTitle}" src="{userImagePath}" />' +
							'<video autoplay="autoplay" class="local hide" muted="muted"></video>' +
						'</div>' +
						'<div class="panel-title">{panelTitle}</div>' +
						'<div class="panel-profile">...</div>' +
						'<div class="hide chat-video-ctrl">' +
							'<div class="chat-video-msg">' +
								'<div class="msg"></div>' +
								'<div class="working"></div>' +
							'</div>' +
							'<div class="chat-video-ctrl-buttons">' +
								'<a class="accept hide" href="javascript:void(0);" title="{acceptTitle}"></a>' +
								'<a class="hangup hide" href="javascript:void(0);" title="{hangUpTitle}"></a>' +
								'<a class="call hide" href="javascript:void(0);" title="{callTitle}"></a>' +
								'<a class="hide mike unmuted" href="javascript:void(0);" title="{muteUnmuteTitle}"></a>' +
								'<a class="fullscreen hide off" href="javascript:void(0);" title="{fullScreenTitle}"></a>' +
								'<div style="clear: both;"></div>' +
							'</div>' +
						'</div>' +
						'<div class="panel-output"></div>' +
						'<div class="panel-input">' +
							'<textarea class="message-input"></textarea>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</li>';

		var TPL_CHAT_VIDEO_AVAILABLE = '<div class="chat-video-available"></div>';

		var TPL_SHOW_ME_AS_AVAILABLE_SETTING_LI = '<li>' +
				'<label for="availableForChatVideo">' +
					'<input checked="checked" id="availableForChatVideo" type="checkbox"> {showMeAsAvailableText}' +
				'</label>' +
			'</li>';

		Liferay.Chat.VideoManager = {
			init: function(chatManager) {
				var instance = this;

				instance._chatManager = chatManager;

				instance._buddies = {};
				instance._portletId = A.one('#chatVideoPortletId').val();
				instance._webRtcManager = Liferay.Chat.WebRtcManager;

				if (instance._webRtcManager.isSupported()) {
					var pollerNotificationsTimeout = A.Lang.toInt(A.one('#chatVideoPortletPollerNotificationsTimeout').val());
					var pollerRequestTimeout = A.Lang.toInt(A.one('#chatVideoPortletPollerRequestTimeout').val());

					instance._fastPollingRate = false;
					instance._fastPollingRateDelayMs = (pollerNotificationsTimeout + pollerRequestTimeout + 100);
					instance._increasedPollingCountMs = 0;
					instance._increasedPollingMaxCountMs = 30000;

					Liferay.Poller.addListener(instance._portletId, instance._onPollerUpdate, instance);

					Liferay.on(
						'sessionExpired',
						function(event) {
							instance._stopFastPolling();
							Liferay.Poller.removeListener(instance._portletId);
						}
					);

					instance._webRtcManager.init(
						{
							cb: {
								disableInRinging: A.bind('disableInRinging', instance),

								disableOutRinging: A.bind('disableOutRinging', instance),

								enableInRinging: A.bind('enableInRinging', instance),

								enableOutRinging: A.bind('enableOutRinging', instance),

								ensurePanel: function(userId) {
									var buddy = instance._chatManager._buddies[userId];

									if (buddy) {
										var chat = instance._chatManager._chatSessions[userId];

										if (!chat) {
											chat = instance._chatManager._createChatSession(
												{
													fullName: buddy.fullName,
													portraitURL: buddy.portraitURL,
													statusMessage: buddy.statusMessage,
													userId: buddy.userId
												}
											);
										}
									}
								},

								isUserAvailable: function(userId) {
									return instance.isUserAvailable(userId);
								},

								onMediaDisabled: function() {
									instance.unmute();
								},

								onMediaEnabled: function() {
									instance.unmute();
								},

								send: function(payload) {
									instance._send(payload);
								}
							}
						}
					);

					instance._inRingingEl = A.one('#chatVideoInRingtone').getDOM();
					instance._outRingingEl = A.one('#chatVideoOutRingtone').getDOM();
					instance._chatVideoOverlayNode = A.one('#chatVideoOverlay');
					instance._chatVideoOverlayEl = instance._chatVideoOverlayNode.getDOM();
					instance._overlayVideoCallTimeNode = instance._chatVideoOverlayNode.one('.call-time');

					instance._chatVideoOverlayEl.addEventListener('animationend', A.bind('_onOverlayAnimationEnd', instance));
					instance._chatVideoOverlayEl.addEventListener('webkitAnimationEnd', A.bind('_onOverlayAnimationEnd', instance));

					/* Modify the "Play sound..." setting checkbox text to include sounds of
					 * video calls. This is hackish using plain DOM elements because we need
					 * to modify a text node without touching the checkbox node.
					 */
					var playSoundLabelEl = A.one('#playSound').ancestor().getDOM();

					var playSoundLabelTextEl = playSoundLabelEl.childNodes[1];

					playSoundLabelTextEl.nodeValue = ' ' + Liferay.Language.get('play-a-sound');

					var showOnlineSettingNode = A.one('#onlineStatus').ancestor('li');

					var availableForChatVideoSettingHtml = A.Lang.sub(
						TPL_SHOW_ME_AS_AVAILABLE_SETTING_LI,
						{
							showMeAsAvailableText: Liferay.Language.get('show-me-as-available')
						}
					);

					var availableForChatVideoSettingNode = A.Node.create(availableForChatVideoSettingHtml);

					showOnlineSettingNode.placeAfter(availableForChatVideoSettingNode);

					instance._availableForChatVideoSettingCheckboxNode = A.one('#availableForChatVideo');

					instance._afterUpdateSettings();
				}
			},

			appendNodeToOverlay: function(node) {
				var instance = this;

				node.appendTo(instance._chatVideoOverlayNode);
			},

			disableInRinging: function() {
				var instance = this;

				instance._tryDisableAudio(instance._inRingingEl);
			},

			disableOutRinging: function() {
				var instance = this;

				instance._tryDisableAudio(instance._outRingingEl);
			},

			enableInRinging: function() {
				var instance = this;

				if (instance._chatManager._playSound) {
					instance._inRingingEl.play();
				}
			},

			enableOutRinging: function() {
				var instance = this;

				if (instance._chatManager._playSound) {
					instance._outRingingEl.play();
				}
			},

			hideOverlay: function() {
				var instance = this;

				var chatVideoOverlayNode = instance._chatVideoOverlayNode;

				if (chatVideoOverlayNode.hasClass('chat-video-fade-in')) {
					chatVideoOverlayNode.replaceClass('chat-video-fade-in', 'chat-video-fade-out');
				}
			},

			isAvailable: function() {
				var instance = this;

				var available = false;

				var availableForChatVideoSettingCheckboxNode = instance._availableForChatVideoSettingCheckboxNode;

				if (!A.Lang.isUndefined(availableForChatVideoSettingCheckboxNode)) {
					available = availableForChatVideoSettingCheckboxNode.attr('checked');
				}

				return available;
			},

			isUserAvailable: function(userId) {
				var instance = this;

				return A.Lang.isValue(userId) && !A.Lang.isUndefined(instance._buddies[userId]);
			},

			mute: function() {
				var instance = this;

				instance._webRtcManager.muteMike();
				instance._updateMikeButtons('muted');
			},

			onChatVideoConversationStateChange: function() {
				var instance = this;

				var globalState = instance._webRtcManager.getConversationsGlobalState();

				if (globalState.communicationRequired) {
					instance._startFastPolling();
				}
				else {
					instance._stopFastPolling();
				}
			},

			setOverlayVideoCallTime: function(timeStr) {
				var instance = this;

				instance._overlayVideoCallTimeNode.setContent(timeStr);
			},

			showOverlay: function() {
				var instance = this;

				var chatVideoOverlayNode = instance._chatVideoOverlayNode

				chatVideoOverlayNode.replaceClass('chat-video-fade-out', 'chat-video-fade-in');

				chatVideoOverlayNode.show();
			},

			unmute: function() {
				var instance = this;

				instance._webRtcManager.unmuteMike();
				instance._updateMikeButtons('unmuted');
			},

			_afterUpdateBuddies: function(buddies) {
				var instance = this;

				var listItems = instance._chatManager._onlineBuddies.all('li.user');

				listItems.each(
					function(item, index, collection) {
						var userId = item.attr('data-userId');
						var userImageNode = item.one('img');

						if (instance.isUserAvailable(userId)) {
							userImageNode.placeAfter(TPL_CHAT_VIDEO_AVAILABLE);
						}
					}
				);
			},

			_afterUpdateSettings: function() {
				var instance = this;

				var globalState = instance._webRtcManager.getConversationsGlobalState();

				if (!instance._chatManager._playSound) {
					instance.disableOutRinging();
					instance.disableInRinging();
				}
				else {
					if (globalState.inRinging) {
						instance.enableInRinging();
					}

					if (globalState.outRinging) {
						instance.enableOutRinging();
					}
				}

				if (!A.Lang.isUndefined(instance._availableForChatVideoSettingCheckboxNode)) {
					var available = instance.isAvailable();

					instance._webRtcManager.sendSetAvailabilityMsg(available);

					if (!available) {
						var chatSessions = instance._chatManager._chatSessions;

						for (var id in chatSessions) {
							var session = chatSessions[id];

							session.hideCtrlButtons();
						}
					}
				}
			},

			_onOverlayAnimationEnd: function(event) {
				var instance = this;

				if (event.animationName === 'chat-video-fade-out-kf') {
					instance._chatVideoOverlayNode.hide();
				}
			},

			_onPanelClose: function(event) {
				var instance = this;

				var target = event.target;

				var userId = target._panelId;

				if (target instanceof Liferay.Chat.Conversation) {
					instance._chatManager._chatSessions[userId].onDelete();
				}
			},

			_onPollerUpdate: function(response, chunk) {
				var instance = this;

				instance._buddies = {};

				var clients = response.webRTCResponse.clients;

				for (var i in clients) {
					instance._buddies[clients[i]] = true;
				}

				var chatSessions = instance._chatManager._chatSessions;

				for (var id in chatSessions) {
					var session = chatSessions[id];

					var panelId = session._panelId;

					if (panelId in instance._buddies) {
						session.setAvailableForChatVideo(instance.isUserAvailable(panelId));
					}
					else {
						session.setAvailableForChatVideo(false);
					}
				}

				instance._webRtcManager.processWebRtcMails(response.webRTCResponse.mails);

				if (instance._fastPollingRate) {
					instance._increasedPollingCountMs += instance._fastPollingRateDelayMs;

					if (instance._increasedPollingCountMs >= instance._increasedPollingMaxCountMs) {
						instance._stopFastPolling();
					}
				}
			},

			_send: function(payload) {
				var instance = this;

				Liferay.Poller.submitRequest(instance._portletId, payload);
			},

			_setFastPollingRate: function(fastPollingRate) {
				var instance = this;

				instance._fastPollingRate = fastPollingRate;
			},

			_startFastPolling: function() {
				var instance = this;

				instance._increasedPollingCountMs = 0;

				instance._setFastPollingRate(true);

				Liferay.Poller.setCustomDelay(instance._fastPollingRateDelayMs);
			},

			_stopFastPolling: function() {
				var instance = this;

				instance._setFastPollingRate(false);

				Liferay.Poller.cancelCustomDelay();
			},

			_tryDisableAudio: function(el) {
				/* We do this here because when modifying the playback state
				 * of an HTMLMediaElement, it can throw some exceptions when
				 * not ready for some reason. Since it's not loaded anyway,
				 * we don't care about the raised exception since it's not
				 * playing and we want to disable it anyway.
				 */
				try {
					el.pause();
					el.currentTime = 0;
				}
				// Probably not ready yet: not playing anyway
				catch (e) {
				}
			},

			_updateMikeButtons: function(newClass) {
				var instance = this;

				for (var id in instance._chatManager._chatSessions) {
					instance._chatManager._chatSessions[id].updateChatVideoMikeButton(newClass);
				}
			}
		};

		Liferay.Chat.VideoCallTimer = function(onTimeChange) {
			var instance = this;

			instance._onTimeChange = onTimeChange;
			instance._timer = null;
		};

		Liferay.Chat.VideoCallTimer.prototype = {
			reset: function() {
				var instance = this;

				if (instance._timer !== null) {
					clearInterval(instance._timer);

					instance._timer = null;
				}
			},

			start: function() {
				var instance = this;

				instance.reset();

				instance._beginMs = A.Lang.now();

				instance._timer = setInterval(
					function() {
						instance._onTick();
					},
					1000
				);
			},

			_onTick: function() {
				var instance = this;

				var curTimeMs = A.Lang.now();
				var elapsedMsTotal = curTimeMs - instance._beginMs;
				var elapsedSeconds = parseInt(elapsedMsTotal / 1000, 10);
				var elapsedHours = parseInt(elapsedSeconds / 3600, 10);

				elapsedSeconds -= elapsedHours * 3600;

				var elapsedMinutes = parseInt(elapsedSeconds / 60, 10);

				elapsedSeconds -= elapsedMinutes * 60;

				if (elapsedSeconds < 10) {
					elapsedSeconds = '0' + elapsedSeconds;
				}

				var elapsedTimeString = '';

				if (elapsedHours > 0) {
					elapsedTimeString += elapsedHours + ':';

					if (elapsedMinutes < 10) {
						elapsedMinutes = '0' + elapsedMinutes;
					}
				}

				elapsedTimeString += elapsedMinutes + ':' + elapsedSeconds;

				instance._onTimeChange(elapsedTimeString);
			}
		};

		Liferay.Chat.VideoConversationStatus = function(node) {
			var instance = this;

			instance._destroyed = false;
			instance._node = node;
			instance._msgNode = node.one('.msg');
			instance._workingNode = node.one('.working');
			instance._errorTimeout = null;

			instance.hide();
		};

		Liferay.Chat.VideoConversationStatus.prototype = {
			destroy: function() {
				var instance = this;

				// Make sure to cancel future events

				instance._stopErrorMessage();

				instance._destroyed = true;
			},

			hide: function() {
				var instance = this;

				if (!instance._destroyed && instance._errorTimeout === null) {
					if (instance._node.hasClass('chat-video-fade-in')) {
						instance._node.replaceClass('chat-video-fade-in', 'chat-video-fade-out');
					}
				}
			},

			setErrorMessage: function(msg) {
				var instance = this;

				var node = instance._node;

				if (!instance._destroyed) {
					instance._stopErrorMessage();

					node.replaceClass('in-call', 'error');
					instance._workingNode.hide();
					instance._msgNode.html(msg);

					instance.show();

					instance._errorTimeout = setTimeout(
						function() {
							instance._errorTimeout = null;
							node.replaceClass('chat-video-fade-in', 'chat-video-fade-out');
						},
						3000
					);
				}
			},

			setInCallMessage: function(msg) {
				var instance = this;

				if (!instance._destroyed) {
					instance._stopErrorMessage();

					instance._node.replaceClass('error', 'in-call');
					instance._workingNode.hide();
					instance._msgNode.html(msg);

					instance.show();
				}
			},

			setRegularMessage: function(msg, working) {
				var instance = this;

				var node = instance._node;

				if (!instance._destroyed) {
					if (A.Lang.isUndefined(working)) {
						working = false;
					}

					instance._stopErrorMessage();

					node.removeClass('in-call');
					node.removeClass('error');

					instance._msgNode.html(msg);

					instance._workingNode.toggle(working);

					instance.show();
				}
			},

			show: function() {
				var instance = this;

				var node = instance._node;

				if (!instance._destroyed) {
					node.show();
					node.replaceClass('chat-video-fade-out', 'chat-video-fade-in');
				}
			},

			_stopErrorMessage: function() {
				var instance = this;

				if (instance._errorTimeout !== null) {
					clearTimeout(instance._errorTimeout);

					instance._errorTimeout = null;

					instance.hide();
				}
			}
		};

		Liferay.on(
			'chatPortletReady',
			function(event) {
				var instance = this;

				var Chat = Liferay.Chat;
				var Lang = Liferay.Language;
				var chatManager = Chat.Manager;
				var videoManager = Chat.VideoManager;

				A.on(
					function(options) {
						var instance = this;

						videoManager.init(instance);
					},
					chatManager,
					'init'
				);

				A.on(videoManager._onPanelClose, chatManager, '_onPanelClose', videoManager);
				A.after(videoManager._afterUpdateBuddies, chatManager, '_updateBuddies', videoManager);
				A.after(videoManager._afterUpdateSettings, chatManager, '_updateSettings', videoManager);

				Chat.ConversationPanel = Chat.Conversation;

				Chat.Conversation = function() {
					var instance = this;

					Chat.Conversation.superclass.constructor.apply(instance, arguments);

					if (Chat.WebRtcManager.isSupported()) {
						instance._availableForChatVideo = false;
						instance._videoCallTimer = null;
						instance._webRtc = null;

						var panel = instance._panel;

						instance._ctrlButtonsContainerNode = panel.one('.chat-video-ctrl');
						instance._ctrlButtonsNode = panel.one('.chat-video-ctrl-buttons');
						instance._localVideoNode = panel.one('.panel-self-view video.local');
						instance._selfViewImgNode = panel.one('.panel-self-view img');
						instance._selfViewNode = panel.one('.panel-self-view');
						instance._remoteVideoContainerNode = panel.one('.remote-video-container');
						instance._remoteVideoOuterNode = panel.one('.remote-video');
						instance._remoteVideoNode = instance._remoteVideoOuterNode.one('video.remote');

						var ctrlButtonsContainerNode = instance._ctrlButtonsContainerNode;

						instance._chatVideoCtrlButtonsNodes = {
							'accept': ctrlButtonsContainerNode.one('a.accept'),
							'call': ctrlButtonsContainerNode.one('a.call'),
							'fullScreen': ctrlButtonsContainerNode.one('a.fullscreen'),
							'hangUp': ctrlButtonsContainerNode.one('a.hangup'),
							'mike': ctrlButtonsContainerNode.one('a.mike')
						};

						var chatVideoCtrlButtonsNodes = instance._chatVideoCtrlButtonsNodes;

						var chatVideoMsgContainerNode = panel.one('.chat-video-msg');

						instance._status = new Chat.VideoConversationStatus(chatVideoMsgContainerNode);

						var status = instance._status;

						instance._videoCallTimer = new Chat.VideoCallTimer(
							function(timeStr) {
								instance._onVideoCallTimeChange(timeStr);
							}
						);

						instance._webRtc = new Chat.WebRtcConversation(
							{
								cb: {
									onError: function(error) {
										var ConversationError = Chat.WebRtcConversation.Error;

										var errorMessages = {};

										errorMessages[ConversationError.CANNOTGETUSERMEDIA] = Lang.get('cannot-access-your-camera');
										errorMessages[ConversationError.HANGUP] = Lang.get('video-call-ended');
										errorMessages[ConversationError.REMOTEPEERDENIEDCALL] = Lang.get('your-friend-denied-your-call');
										errorMessages[ConversationError.REMOTEPEERNOTAVAILABLE] = Lang.get('your-friend-is-not-available');
										errorMessages[ConversationError.REMOTEPEERRESET] = Lang.get('your-friend-had-an-issue');

										if (error in errorMessages) {
											status.setErrorMessage(errorMessages[error]);
										}
									},

									onStateChange: function(state) {
										var State = Chat.WebRtcConversation.State;
										var CONNECTED = State.CONNECTED;
										var DELETED = State.DELETED;
										var DELETING = State.DELETING;
										var GOTCALL = State.GOTCALL;
										var STOPPED = State.STOPPED;
										var STOPPING = State.STOPPING;

										videoManager.onChatVideoConversationStateChange();

										// Accept control button

										if (state === GOTCALL) {
											instance._showCtrlButton('accept');
										}
										else {
											instance._hideCtrlButton('accept');
										}

										// Hang up control button

										if (state === STOPPED || state === STOPPING || state === DELETED || state === DELETING) {
											instance._hideCtrlButton('hangUp');
										}
										else {
											instance._showCtrlButton('hangUp');
										}

										// Call control button

										if (state === STOPPED) {
											instance._showCtrlButton('call');
										}
										else {
											instance._hideCtrlButton('call');
										}

										// Mute/unmute, fullscreen control buttons

										instance._hideCtrlButton('mike');

										instance._hideCtrlButton('fullScreen');

										// Status messages

										if (state === DELETED || state === STOPPED) {
											status.hide();
										}
										else if (state === State.CALLINGWAITING || state === State.GOTCALLWAITING) {
											status.setRegularMessage(Lang.get('please-share-your-camera'), true);
										}
										else if (state === State.CALLING || state === State.CALLED) {
											status.setRegularMessage(Lang.get('calling-friend'), true);
										}
										else if (state === GOTCALL) {
											status.setRegularMessage(Lang.get('incoming-video-call'), true);
										}
										else if (state === State.GOTANSWER || state === State.ANSWERED || state === State.ACCEPTINGCALL) {
											status.setRegularMessage(Lang.get('establishing-connection'), true);
										}
										else if (state === STOPPING || state === DELETING) {
											status.setRegularMessage(Lang.get('stopping-video-call'), true);
										}
										else if (state === CONNECTED) {
											instance._videoCallTimeStr = '0:00';
											status.setInCallMessage(instance._videoCallTimeStr);
										}

										// Fullscreen hiding

										if (state === DELETED || state === DELETING || state === STOPPED || state === STOPPING) {
											instance._disableVideoFullScreen();
										}

										// Remote video hiding

										if (state === DELETED || state === DELETING) {
											instance._remoteVideoContainerNode.hide();
										}
										else if (state === STOPPED || state === STOPPING) {
											instance._hideRemoteVideo();
										}

										// Local video

										if (state === State.CALLING || state === State.CALLED || state === GOTCALL || state === State.ANSWERED ||
											state === State.GOTANSWER || state === State.ACCEPTINGCALL || state === State.DENYINGCALL || state === CONNECTED) {
											instance._showLocalVideo();
										}
										else {
											instance._hideLocalVideo();
										}

										// Video call timer

										if (state === DELETED || state === DELETING || state === STOPPED || state === STOPPING) {
											instance._videoCallTimer.reset();
										}

										// Special handler for connected state

										if (state === CONNECTED) {
											instance._waitForRemoteStreamFlowing();
										}
									},

									onWebRtcEvent: function() {
										if (!instance.get('selected')) {
											instance.setWaiting(true);
										}
									}
								},

								iceServers: [],
								localVideoEl: instance._localVideoNode.getDOM(),
								remoteVideoEl: instance._remoteVideoNode.getDOM(),
								userId: instance._panelId
							}
						);

						var webRtc = instance._webRtc;

						chatVideoCtrlButtonsNodes.accept.on(
							'click',
							function() {
								webRtc.onPressAccept();
							}
						);

						chatVideoCtrlButtonsNodes.hangUp.on(
							'click',
							function() {
								instance._disableVideoFullScreen();
								webRtc.onPressHangUp();
							}
						);

						chatVideoCtrlButtonsNodes.call.on(
							'click',
							function() {
								if (videoManager.isUserAvailable(instance._panelId)) {
									webRtc.onPressCall();
								}
							}
						);

						chatVideoCtrlButtonsNodes.fullScreen.on(
							'click',
							function() {
								instance._toggleFullScreen();
							}
						);

						chatVideoCtrlButtonsNodes.mike.on(
							'click',
							function(event) {
								var currentTarget = event.currentTarget;

								if (currentTarget.hasClass('muted')) {
									videoManager.unmute();
								}
								else {
									videoManager.mute();
								}
							}
						);

						instance._remoteVideoOuterNode.on(
							'click',
							function() {
								instance._toggleFullScreen();
							}
						);

						instance.setAvailableForChatVideo(videoManager.isUserAvailable(instance._panelId));
					}
				};

				A.extend(
					Chat.Conversation,
					Chat.ConversationPanel,
					{
						close: function() {
							var instance = this;

							Chat.Panel.prototype.close.call(instance);
						},

						getWebRtc: function() {
							var instance = this;

							return instance._webRtc;
						},

						hideCtrlButtons: function() {
							var instance = this;

							instance._ctrlButtonsContainerNode.hide();
						},

						onDelete: function() {
							var instance = this;

							instance._videoCallTimer.reset();

							instance._status.destroy();

							if (instance.getWebRtc()) {
								instance.getWebRtc().onDelete();
							}
						},

						setAsRead: function() {
							var instance = this;

							Chat.Conversation.superclass.setAsRead.apply(instance, arguments);
						},

						setAsUnread: function() {
							var instance = this;

							Chat.Conversation.superclass.setAsUnread.apply(instance, arguments);
						},

						setAvailableForChatVideo: function(available) {
							var instance = this;

							instance._availableForChatVideo = available;

							if (instance._webRtc) {
								if (available) {
									instance.showCtrlButtons();
								}
								else {
									instance.hideCtrlButtons();
								}
							}
						},

						showCtrlButtons: function() {
							var instance = this;

							// Prevent showing control buttons if myself is not available for chat video

							if (videoManager.isAvailable()) {
								instance._ctrlButtonsContainerNode.show();
							}
						},

						_disableVideoFullScreen: function() {
							var instance = this;

							videoManager.hideOverlay();

							instance._remoteVideoOuterNode.appendTo(instance._remoteVideoContainerNode);
							instance._localVideoNode.appendTo(instance._selfViewNode);
							instance._ctrlButtonsNode.appendTo(instance._ctrlButtonsContainerNode);
							instance._chatVideoCtrlButtonsNodes.fullScreen.replaceClass('on', 'off');

							instance._playVideos();
						},

						_enableVideoFullScreen: function() {
							var instance = this;

							var remoteVideoOuterNode = instance._remoteVideoOuterNode;

							// Only allow this if we're connected

							if (instance._webRtc.getState() === Chat.WebRtcConversation.State.CONNECTED) {
								videoManager.setOverlayVideoCallTime(instance._videoCallTimeStr);

								videoManager.appendNodeToOverlay(remoteVideoOuterNode);
								instance._localVideoNode.appendTo(remoteVideoOuterNode);
								videoManager.appendNodeToOverlay(instance._ctrlButtonsNode);
								instance._chatVideoCtrlButtonsNodes.fullScreen.replaceClass('off', 'on');

								videoManager.showOverlay();

								instance._playVideos();
							}
						},

						_hideCtrlButton: function(btnId) {
							var instance = this;

							instance._chatVideoCtrlButtonsNodes[btnId].hide();
						},

						_hideLocalVideo: function() {
							var instance = this;

							instance._localVideoNode.hide();
							instance._selfViewImgNode.show();
						},

						_hideRemoteVideo: function() {
							var instance = this;

							var remoteVideoContainerNode = instance._remoteVideoContainerNode;

							if (remoteVideoContainerNode.hasClass('chat-video-show-remote-video')) {
								remoteVideoContainerNode.replaceClass('chat-video-show-remote-video', 'chat-video-hide-remote-video');
							}
						},

						_onRemoteStreamFlowing: function() {
							var instance = this;

							instance._hideCtrlButton('accept');
							instance._hideCtrlButton('call');

							instance._showCtrlButton('fullScreen');
							instance._showCtrlButton('hangUp');
							instance._showCtrlButton('mike');

							instance._disableVideoFullScreen();

							instance._showRemoteVideo();

							instance._videoCallTimer.start();
						},

						_onVideoCallTimeChange: function(timeStr) {
							var instance = this;

							instance._videoCallTimeStr = timeStr;

							instance._status.setInCallMessage(timeStr);

							videoManager.setOverlayVideoCallTime(timeStr);
						},

						_playVideos: function() {
							var instance = this;

							instance._remoteVideoNode.getDOM().play();
							instance._localVideoNode.getDOM().play();
						},

						_setPanelHTML: function() {
							var instance = this;

							var userImagePath = Chat.Util.getUserImagePath(instance._panelIcon);

							// Custom HTML with integrated chat video elements

							var html = A.Lang.sub(
								TPL_CHAT_PANEL,
								{
									acceptTitle: Lang.get('accept-title'),
									callTitle: Lang.get('call-title'),
									fullScreenTitle: Lang.get('fullscreen-title'),
									hangUpTitle: Lang.get('hangup-title'),
									muteUnmuteTitle: Lang.get('mute-unmute-title'),
									panelId: instance._panelId,
									panelTitle: Liferay.Util.escapeHTML(instance._panelTitle),
									userImagePath: userImagePath
								}
							);

							return html;
						},

						_showCtrlButton: function(btnId) {
							var instance = this;

							instance._chatVideoCtrlButtonsNodes[btnId].show();
						},

						_showLocalVideo: function() {
							var instance = this;

							var localVideoNode = instance._localVideoNode;

							instance._selfViewImgNode.hide();

							localVideoNode.show();

							localVideoNode.getDOM().play();
						},

						_showRemoteVideo: function() {
							var instance = this;

							var remoteVideoContainerNode = instance._remoteVideoContainerNode;

							remoteVideoContainerNode.height(0);

							remoteVideoContainerNode.show();

							remoteVideoContainerNode.replaceClass('chat-video-hide-remote-video', 'chat-video-show-remote-video');
						},

						_toggleFullScreen: function() {
							var instance = this;

							if (instance._remoteVideoOuterNode.ancestor().attr('id') === 'chatVideoOverlay') {
								instance._disableVideoFullScreen();
							}
							else {
								instance._enableVideoFullScreen();
							}
						},

						_waitForRemoteStreamFlowing: function() {
							var instance = this;

							if (instance._webRtc.getState() === Chat.WebRtcConversation.State.CONNECTED) {

								// Wait for the remote stream to "flow"

								if (!instance._webRtc.isRemoteStreamFlowing()) {
									setTimeout(
										function() {
											instance._waitForRemoteStreamFlowing();
										},
										250
									);
								}
								else {
									instance._onRemoteStreamFlowing();
								}
							}
						},

						updateChatVideoMikeButton: function(newClass) {
							var instance = this;

							var node = instance._chatVideoCtrlButtonsNodes.mike;

							node.removeClass('muted');
							node.removeClass('unmuted');

							node.addClass(newClass);
						}
					}
				);
			}
		);
	}
);