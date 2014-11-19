/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.pushnotifications.model;

import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.model.ModelWrapper;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * This class is a wrapper for {@link PushNotificationsEntry}.
 * </p>
 *
 * @author Bruno Farache
 * @see PushNotificationsEntry
 * @generated
 */
public class PushNotificationsEntryWrapper implements PushNotificationsEntry,
	ModelWrapper<PushNotificationsEntry> {
	public PushNotificationsEntryWrapper(
		PushNotificationsEntry pushNotificationsEntry) {
		_pushNotificationsEntry = pushNotificationsEntry;
	}

	@Override
	public Class<?> getModelClass() {
		return PushNotificationsEntry.class;
	}

	@Override
	public String getModelClassName() {
		return PushNotificationsEntry.class.getName();
	}

	@Override
	public Map<String, Object> getModelAttributes() {
		Map<String, Object> attributes = new HashMap<String, Object>();

		attributes.put("pushNotificationsEntryId", getPushNotificationsEntryId());
		attributes.put("userId", getUserId());
		attributes.put("createTime", getCreateTime());
		attributes.put("parentPushNotificationsEntryId",
			getParentPushNotificationsEntryId());
		attributes.put("childrenPushNotificationsEntriesCount",
			getChildrenPushNotificationsEntriesCount());
		attributes.put("payload", getPayload());

		return attributes;
	}

	@Override
	public void setModelAttributes(Map<String, Object> attributes) {
		Long pushNotificationsEntryId = (Long)attributes.get(
				"pushNotificationsEntryId");

		if (pushNotificationsEntryId != null) {
			setPushNotificationsEntryId(pushNotificationsEntryId);
		}

		Long userId = (Long)attributes.get("userId");

		if (userId != null) {
			setUserId(userId);
		}

		Long createTime = (Long)attributes.get("createTime");

		if (createTime != null) {
			setCreateTime(createTime);
		}

		Long parentPushNotificationsEntryId = (Long)attributes.get(
				"parentPushNotificationsEntryId");

		if (parentPushNotificationsEntryId != null) {
			setParentPushNotificationsEntryId(parentPushNotificationsEntryId);
		}

		Integer childrenPushNotificationsEntriesCount = (Integer)attributes.get(
				"childrenPushNotificationsEntriesCount");

		if (childrenPushNotificationsEntriesCount != null) {
			setChildrenPushNotificationsEntriesCount(childrenPushNotificationsEntriesCount);
		}

		String payload = (String)attributes.get("payload");

		if (payload != null) {
			setPayload(payload);
		}
	}

	/**
	* Returns the primary key of this push notifications entry.
	*
	* @return the primary key of this push notifications entry
	*/
	@Override
	public long getPrimaryKey() {
		return _pushNotificationsEntry.getPrimaryKey();
	}

	/**
	* Sets the primary key of this push notifications entry.
	*
	* @param primaryKey the primary key of this push notifications entry
	*/
	@Override
	public void setPrimaryKey(long primaryKey) {
		_pushNotificationsEntry.setPrimaryKey(primaryKey);
	}

	/**
	* Returns the push notifications entry ID of this push notifications entry.
	*
	* @return the push notifications entry ID of this push notifications entry
	*/
	@Override
	public long getPushNotificationsEntryId() {
		return _pushNotificationsEntry.getPushNotificationsEntryId();
	}

	/**
	* Sets the push notifications entry ID of this push notifications entry.
	*
	* @param pushNotificationsEntryId the push notifications entry ID of this push notifications entry
	*/
	@Override
	public void setPushNotificationsEntryId(long pushNotificationsEntryId) {
		_pushNotificationsEntry.setPushNotificationsEntryId(pushNotificationsEntryId);
	}

	/**
	* Returns the user ID of this push notifications entry.
	*
	* @return the user ID of this push notifications entry
	*/
	@Override
	public long getUserId() {
		return _pushNotificationsEntry.getUserId();
	}

	/**
	* Sets the user ID of this push notifications entry.
	*
	* @param userId the user ID of this push notifications entry
	*/
	@Override
	public void setUserId(long userId) {
		_pushNotificationsEntry.setUserId(userId);
	}

	/**
	* Returns the user uuid of this push notifications entry.
	*
	* @return the user uuid of this push notifications entry
	* @throws SystemException if a system exception occurred
	*/
	@Override
	public java.lang.String getUserUuid()
		throws com.liferay.portal.kernel.exception.SystemException {
		return _pushNotificationsEntry.getUserUuid();
	}

	/**
	* Sets the user uuid of this push notifications entry.
	*
	* @param userUuid the user uuid of this push notifications entry
	*/
	@Override
	public void setUserUuid(java.lang.String userUuid) {
		_pushNotificationsEntry.setUserUuid(userUuid);
	}

	/**
	* Returns the create time of this push notifications entry.
	*
	* @return the create time of this push notifications entry
	*/
	@Override
	public long getCreateTime() {
		return _pushNotificationsEntry.getCreateTime();
	}

	/**
	* Sets the create time of this push notifications entry.
	*
	* @param createTime the create time of this push notifications entry
	*/
	@Override
	public void setCreateTime(long createTime) {
		_pushNotificationsEntry.setCreateTime(createTime);
	}

	/**
	* Returns the parent push notifications entry ID of this push notifications entry.
	*
	* @return the parent push notifications entry ID of this push notifications entry
	*/
	@Override
	public long getParentPushNotificationsEntryId() {
		return _pushNotificationsEntry.getParentPushNotificationsEntryId();
	}

	/**
	* Sets the parent push notifications entry ID of this push notifications entry.
	*
	* @param parentPushNotificationsEntryId the parent push notifications entry ID of this push notifications entry
	*/
	@Override
	public void setParentPushNotificationsEntryId(
		long parentPushNotificationsEntryId) {
		_pushNotificationsEntry.setParentPushNotificationsEntryId(parentPushNotificationsEntryId);
	}

	/**
	* Returns the children push notifications entries count of this push notifications entry.
	*
	* @return the children push notifications entries count of this push notifications entry
	*/
	@Override
	public int getChildrenPushNotificationsEntriesCount() {
		return _pushNotificationsEntry.getChildrenPushNotificationsEntriesCount();
	}

	/**
	* Sets the children push notifications entries count of this push notifications entry.
	*
	* @param childrenPushNotificationsEntriesCount the children push notifications entries count of this push notifications entry
	*/
	@Override
	public void setChildrenPushNotificationsEntriesCount(
		int childrenPushNotificationsEntriesCount) {
		_pushNotificationsEntry.setChildrenPushNotificationsEntriesCount(childrenPushNotificationsEntriesCount);
	}

	/**
	* Returns the payload of this push notifications entry.
	*
	* @return the payload of this push notifications entry
	*/
	@Override
	public java.lang.String getPayload() {
		return _pushNotificationsEntry.getPayload();
	}

	/**
	* Sets the payload of this push notifications entry.
	*
	* @param payload the payload of this push notifications entry
	*/
	@Override
	public void setPayload(java.lang.String payload) {
		_pushNotificationsEntry.setPayload(payload);
	}

	@Override
	public boolean isNew() {
		return _pushNotificationsEntry.isNew();
	}

	@Override
	public void setNew(boolean n) {
		_pushNotificationsEntry.setNew(n);
	}

	@Override
	public boolean isCachedModel() {
		return _pushNotificationsEntry.isCachedModel();
	}

	@Override
	public void setCachedModel(boolean cachedModel) {
		_pushNotificationsEntry.setCachedModel(cachedModel);
	}

	@Override
	public boolean isEscapedModel() {
		return _pushNotificationsEntry.isEscapedModel();
	}

	@Override
	public java.io.Serializable getPrimaryKeyObj() {
		return _pushNotificationsEntry.getPrimaryKeyObj();
	}

	@Override
	public void setPrimaryKeyObj(java.io.Serializable primaryKeyObj) {
		_pushNotificationsEntry.setPrimaryKeyObj(primaryKeyObj);
	}

	@Override
	public com.liferay.portlet.expando.model.ExpandoBridge getExpandoBridge() {
		return _pushNotificationsEntry.getExpandoBridge();
	}

	@Override
	public void setExpandoBridgeAttributes(
		com.liferay.portal.model.BaseModel<?> baseModel) {
		_pushNotificationsEntry.setExpandoBridgeAttributes(baseModel);
	}

	@Override
	public void setExpandoBridgeAttributes(
		com.liferay.portlet.expando.model.ExpandoBridge expandoBridge) {
		_pushNotificationsEntry.setExpandoBridgeAttributes(expandoBridge);
	}

	@Override
	public void setExpandoBridgeAttributes(
		com.liferay.portal.service.ServiceContext serviceContext) {
		_pushNotificationsEntry.setExpandoBridgeAttributes(serviceContext);
	}

	@Override
	public java.lang.Object clone() {
		return new PushNotificationsEntryWrapper((PushNotificationsEntry)_pushNotificationsEntry.clone());
	}

	@Override
	public int compareTo(
		com.liferay.pushnotifications.model.PushNotificationsEntry pushNotificationsEntry) {
		return _pushNotificationsEntry.compareTo(pushNotificationsEntry);
	}

	@Override
	public int hashCode() {
		return _pushNotificationsEntry.hashCode();
	}

	@Override
	public com.liferay.portal.model.CacheModel<com.liferay.pushnotifications.model.PushNotificationsEntry> toCacheModel() {
		return _pushNotificationsEntry.toCacheModel();
	}

	@Override
	public com.liferay.pushnotifications.model.PushNotificationsEntry toEscapedModel() {
		return new PushNotificationsEntryWrapper(_pushNotificationsEntry.toEscapedModel());
	}

	@Override
	public com.liferay.pushnotifications.model.PushNotificationsEntry toUnescapedModel() {
		return new PushNotificationsEntryWrapper(_pushNotificationsEntry.toUnescapedModel());
	}

	@Override
	public java.lang.String toString() {
		return _pushNotificationsEntry.toString();
	}

	@Override
	public java.lang.String toXmlString() {
		return _pushNotificationsEntry.toXmlString();
	}

	@Override
	public void persist()
		throws com.liferay.portal.kernel.exception.SystemException {
		_pushNotificationsEntry.persist();
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}

		if (!(obj instanceof PushNotificationsEntryWrapper)) {
			return false;
		}

		PushNotificationsEntryWrapper pushNotificationsEntryWrapper = (PushNotificationsEntryWrapper)obj;

		if (Validator.equals(_pushNotificationsEntry,
					pushNotificationsEntryWrapper._pushNotificationsEntry)) {
			return true;
		}

		return false;
	}

	/**
	 * @deprecated As of 6.1.0, replaced by {@link #getWrappedModel}
	 */
	public PushNotificationsEntry getWrappedPushNotificationsEntry() {
		return _pushNotificationsEntry;
	}

	@Override
	public PushNotificationsEntry getWrappedModel() {
		return _pushNotificationsEntry;
	}

	@Override
	public void resetOriginalValues() {
		_pushNotificationsEntry.resetOriginalValues();
	}

	private PushNotificationsEntry _pushNotificationsEntry;
}