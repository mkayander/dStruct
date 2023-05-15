// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'de'
	| 'en'
	| 'ru'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	/**
	 * D​a​t​a​ ​S​t​r​u​c​t​u​r​e​s​ ​S​i​m​p​l​i​f​i​e​d
	 */
	DATA_STRUCTURES_SIMPLIFIED: string
	/**
	 * V​i​s​u​a​l​i​z​e​ ​y​o​u​r​ ​L​e​e​t​C​o​d​e​ ​p​r​o​b​l​e​m​s​ ​j​u​s​t​ ​f​o​r​m​ ​y​o​u​r​ ​c​o​d​e
	 */
	VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE: string
	/**
	 * T​r​y​ ​i​t​ ​o​u​t​ ​n​o​w
	 */
	TRY_IT_OUT_NOW: string
	/**
	 * {​n​a​m​e​}​'​s​ ​D​a​s​h​b​o​a​r​d
	 * @param {string} name
	 */
	USER_DASHBOARD: RequiredParams<'name'>
	/**
	 * S​i​g​n​ ​i​n
	 */
	SIGN_IN: string
	/**
	 * S​i​g​n​ ​i​n​ ​w​i​t​h​ ​G​i​t​H​u​b​ ​o​r​ ​G​o​o​g​l​e​ ​i​n​ ​t​h​e​ ​t​o​p​ ​r​i​g​h​t​ ​c​o​r​n​e​r
	 */
	SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT: string
	/**
	 * S​i​g​n​ ​i​n​ ​t​o​ ​k​e​e​p​ ​t​r​a​c​k​ ​o​f​ ​y​o​u​r​ ​p​r​o​g​r​e​s​s​ ​a​n​d​ ​m​o​r​e​!
	 */
	SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE: string
	/**
	 * O​p​e​n​ ​o​p​t​i​o​n​s
	 */
	OPEN_OPTIONS: string
	/**
	 * P​r​o​f​i​l​e
	 */
	PROFILE: string
	/**
	 * F​e​e​d​b​a​c​k
	 */
	FEEDBACK: string
	/**
	 * L​o​g​o​u​t
	 */
	LOGOUT: string
	/**
	 * D​S​t​r​u​c​t​ ​L​o​g​o
	 */
	DSTRUCT_LOGO: string
	/**
	 * L​a​n​g​u​a​g​e
	 */
	LANGUAGE: string
	/**
	 * M​a​i​n​ ​M​e​n​u
	 */
	MAIN_MENU: string
	/**
	 * S​e​t​t​i​n​g​s
	 */
	SETTINGS: string
	/**
	 * D​a​r​k​ ​M​o​d​e
	 */
	DARK_MODE: string
	/**
	 * C​u​r​r​e​n​t​ ​u​s​e​r​ ​a​c​c​o​u​n​t
	 */
	CURRENT_USER_ACCOUNT: string
	/**
	 * C​h​o​o​s​e​ ​l​o​c​a​l​e​.​.​.
	 */
	CHOOSE_LOCALE: string
	/**
	 * H​e​l​l​o​ ​{​n​a​m​e​}​!
	 * @param {string} name
	 */
	HI: RequiredParams<'name'>
	/**
	 * E​d​i​t​ ​<​c​o​d​e​>​p​a​g​e​s​/​i​n​d​e​x​.​t​s​x​<​/​c​o​d​e​>​ ​a​n​d​ ​s​a​v​e​ ​t​o​ ​r​e​l​o​a​d​.
	 */
	EDIT_AND_SAVE: string
	/**
	 * Y​o​u​r​ ​n​a​m​e​:
	 */
	YOUR_NAME: string
	/**
	 * S​e​l​e​c​t​e​d​ ​l​o​c​a​l​e​:
	 */
	SELECTED_LOCALE: string
	/**
	 * T​o​d​a​y​ ​i​s​ ​{​d​a​t​e​|​w​e​e​k​d​a​y​}
	 * @param {Date} date
	 */
	TODAY: RequiredParams<'date|weekday'>
}

export type TranslationFunctions = {
	/**
	 * Data Structures Simplified
	 */
	DATA_STRUCTURES_SIMPLIFIED: () => LocalizedString
	/**
	 * Visualize your LeetCode problems just form your code
	 */
	VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE: () => LocalizedString
	/**
	 * Try it out now
	 */
	TRY_IT_OUT_NOW: () => LocalizedString
	/**
	 * {name}'s Dashboard
	 */
	USER_DASHBOARD: (arg: { name: string }) => LocalizedString
	/**
	 * Sign in
	 */
	SIGN_IN: () => LocalizedString
	/**
	 * Sign in with GitHub or Google in the top right corner
	 */
	SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT: () => LocalizedString
	/**
	 * Sign in to keep track of your progress and more!
	 */
	SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE: () => LocalizedString
	/**
	 * Open options
	 */
	OPEN_OPTIONS: () => LocalizedString
	/**
	 * Profile
	 */
	PROFILE: () => LocalizedString
	/**
	 * Feedback
	 */
	FEEDBACK: () => LocalizedString
	/**
	 * Logout
	 */
	LOGOUT: () => LocalizedString
	/**
	 * DStruct Logo
	 */
	DSTRUCT_LOGO: () => LocalizedString
	/**
	 * Language
	 */
	LANGUAGE: () => LocalizedString
	/**
	 * Main Menu
	 */
	MAIN_MENU: () => LocalizedString
	/**
	 * Settings
	 */
	SETTINGS: () => LocalizedString
	/**
	 * Dark Mode
	 */
	DARK_MODE: () => LocalizedString
	/**
	 * Current user account
	 */
	CURRENT_USER_ACCOUNT: () => LocalizedString
	/**
	 * Choose locale...
	 */
	CHOOSE_LOCALE: () => LocalizedString
	/**
	 * Hello {name}!
	 */
	HI: (arg: { name: string }) => LocalizedString
	/**
	 * Edit <code>pages/index.tsx</code> and save to reload.
	 */
	EDIT_AND_SAVE: () => LocalizedString
	/**
	 * Your name:
	 */
	YOUR_NAME: () => LocalizedString
	/**
	 * Selected locale:
	 */
	SELECTED_LOCALE: () => LocalizedString
	/**
	 * Today is {date|weekday}
	 */
	TODAY: (arg: { date: Date }) => LocalizedString
}

export type Formatters = {
	weekday: (value: Date) => unknown
}
