import React, { Component, createContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  getCurrentLocale,
  getCurrentLocaleMessages,
  getEnLocaleMessages,
} from '../ducks/locale/locale';
import { getMessage } from '../helpers/utils/i18n-helper';

export const I18nContext = createContext((key) => `[${key}]`);

export const I18nProvider = (props) => {
  const currentLocale = useSelector(getCurrentLocale);
  const current = useSelector(getCurrentLocaleMessages);
  const en = useSelector(getEnLocaleMessages);

  const t = useMemo(() => {
    return (key, ...args) =>
      getMessage(currentLocale, current, key, ...args) ||
      getMessage(currentLocale, en, key, ...args);
  }, [currentLocale, current, en]);

  return (
    <I18nContext.Provider value={t}>{props.children}</I18nContext.Provider>
  );
};

I18nProvider.propTypes = {
  children: PropTypes.node,
};

I18nProvider.defaultProps = {
  children: undefined,
};
