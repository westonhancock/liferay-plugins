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

package com.liferay.pushnotifications.service;

import com.liferay.portal.service.ServiceWrapper;

/**
 * Provides a wrapper for {@link PushNotificationsEntryService}.
 *
 * @author Bruno Farache
 * @see PushNotificationsEntryService
 * @generated
 */
public class PushNotificationsEntryServiceWrapper
	implements PushNotificationsEntryService,
		ServiceWrapper<PushNotificationsEntryService> {
	public PushNotificationsEntryServiceWrapper(
		PushNotificationsEntryService pushNotificationsEntryService) {
		_pushNotificationsEntryService = pushNotificationsEntryService;
	}

	/**
	* Returns the Spring bean ID for this bean.
	*
	* @return the Spring bean ID for this bean
	*/
	@Override
	public java.lang.String getBeanIdentifier() {
		return _pushNotificationsEntryService.getBeanIdentifier();
	}

	/**
	* Sets the Spring bean ID for this bean.
	*
	* @param beanIdentifier the Spring bean ID for this bean
	*/
	@Override
	public void setBeanIdentifier(java.lang.String beanIdentifier) {
		_pushNotificationsEntryService.setBeanIdentifier(beanIdentifier);
	}

	@Override
	public java.lang.Object invokeMethod(java.lang.String name,
		java.lang.String[] parameterTypes, java.lang.Object[] arguments)
		throws java.lang.Throwable {
		return _pushNotificationsEntryService.invokeMethod(name,
			parameterTypes, arguments);
	}

	@Override
	public void addPushNotificationsEntry(java.lang.String payload)
		throws com.liferay.portal.kernel.exception.PortalException,
			com.liferay.portal.kernel.exception.SystemException {
		_pushNotificationsEntryService.addPushNotificationsEntry(payload);
	}

	@Override
	public java.util.List<com.liferay.pushnotifications.model.PushNotificationsEntry> getPushNotificationsEntries(
		long parentPushNotificationsEntryId, long lastAccessTime, int start,
		int end) throws com.liferay.portal.kernel.exception.SystemException {
		return _pushNotificationsEntryService.getPushNotificationsEntries(parentPushNotificationsEntryId,
			lastAccessTime, start, end);
	}

	/**
	 * @deprecated As of 6.1.0, replaced by {@link #getWrappedService}
	 */
	public PushNotificationsEntryService getWrappedPushNotificationsEntryService() {
		return _pushNotificationsEntryService;
	}

	/**
	 * @deprecated As of 6.1.0, replaced by {@link #setWrappedService}
	 */
	public void setWrappedPushNotificationsEntryService(
		PushNotificationsEntryService pushNotificationsEntryService) {
		_pushNotificationsEntryService = pushNotificationsEntryService;
	}

	@Override
	public PushNotificationsEntryService getWrappedService() {
		return _pushNotificationsEntryService;
	}

	@Override
	public void setWrappedService(
		PushNotificationsEntryService pushNotificationsEntryService) {
		_pushNotificationsEntryService = pushNotificationsEntryService;
	}

	private PushNotificationsEntryService _pushNotificationsEntryService;
}