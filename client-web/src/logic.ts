import * as _ from 'underscore';
import createStore from 'redux-zero';
import { Location, Action } from 'history';
import createBrowserHistory from 'history/createBrowserHistory';
import { Record, User, Model } from './types';

const customHistory = createBrowserHistory();

const pageGroups = [
	{ key: 'frontend', title: 'A:\\>', icon: 'laptop' },
	{ key: 'backend', title: 'B:\\>', icon: 'desktop' },
];

const pageGroupByKey = _.indexBy(pageGroups, 'key');

const homePage = { key: 'home', title: 'Home' };

const pages = [
	{ key: 'a_pages', group: pageGroupByKey.frontend, title: 'Pages', icon: 'file' },
	{ key: 'a_models', group: pageGroupByKey.frontend, title: 'Models', icon: 'file-text' },
	{ key: 'a_files', group: pageGroupByKey.frontend, title: 'Files', icon: 'hdd' },
	{ key: 'a_collections', group: pageGroupByKey.frontend, title: 'Collections', icon: 'table' },
	{ key: 'a_users', group: pageGroupByKey.frontend, title: 'Users', icon: 'team' },
	{ key: 'a_emails', group: pageGroupByKey.frontend, title: 'Emails', icon: 'mail' },
	{ key: 'a_translations', group: pageGroupByKey.frontend, title: 'Translations', icon: 'customer-service' },
	{ key: 'a_settings', group: pageGroupByKey.frontend, title: 'Settings', icon: 'setting' },
	{ key: 'b_users', group: pageGroupByKey.backend, title: 'Users', icon: 'team' },
	{ key: 'b_emails', group: pageGroupByKey.backend, title: 'Emails', icon: 'mail' },
	{ key: 'b_settings', group: pageGroupByKey.backend, title: 'Settings', icon: 'setting' },
];

const pagesByKey = _.indexBy(pages, 'key');

interface State {
	starting: boolean;
	pathname: string;
	currentUser: User;
	signinPage: {
		email: string;
		password: string;
		errors: { [key: string]: string };
	};
	modelListPage: {
		records: Model[];
	};

	recordListPage: {
		title: string;
		records: Record[];
	};
	recordDetailPage: {
		title: string;
		record: Record;
		errors: { [key: string]: string };
	};
}

const INITIAL_STATE: State = {
	starting: true,
	pathname: '',
	currentUser: {
		id: '',
		email: '',
	},
	signinPage: {
		email: '',
		password: '',
		errors: {},
	},
	modelListPage: {
		records: [],
	},

	recordListPage: {
		title: '',
		records: [],
	},
	recordDetailPage: {
		title: '',
		record: {
			id: '',
		},
		errors: {},
	},
};

const store = createStore(INITIAL_STATE);

interface StoreSignature {
	getState: { (): State };
	setState: { (callback: { (state: State): State }): void };
}

const createActions = ({ getState, setState }: StoreSignature) => {
	async function initialize(_state: State) {
		customHistory.listen((location: Location, action: Action) => {
			setState((state) => ({ ...state, pathname: location.pathname }));
		});

		// TODO uncomment:
		// const email = await localStorage.getItem('signinPage.email');
		// setState((state) => {
		// 	const signinPage = { ...state.signinPage, email: email || '' };
		// 	return { ...state, signinPage, starting: false };
		// });

		// TODO comment:
		setState((state) => ({
			...state,
			starting: false,
			currentUser: { id: '123', email: 'dario.freire@gmail.com' },
			pathname: customHistory.location.pathname,
		}));
	}

	async function signin(_state: State) {
		const errors = {} as { [key: string]: string };
		if (_state.signinPage.email == null || _state.signinPage.email.trim().length === 0) {
			errors.email = 'Required!';
		}

		if (_state.signinPage.password == null || _state.signinPage.password.trim().length === 0) {
			errors.password = 'Required!';
		}

		if (errors.email || errors.password) {
			setState((state) => {
				const signinPage = { ...state.signinPage, errors };
				return { ...state, signinPage, starting: false };
			});

		} else {
			localStorage.setItem('signinPage.email', _state.signinPage.email);
			setState((state) => ({ ...state, currentUser: { id: '123', email: state.signinPage.email } }));
		}
	}

	async function signout() {
		window.location.href = '/';
	}

	function changeSigninDetail(state: State, payload: { key: string; value: string }): State {
		const signinPage = { ...state.signinPage, [payload.key]: payload.value };
		return { ...state, signinPage };
	}

	async function onEnterRecordList(_state: State) {
		const { pathname } = _state;
		const key = pathname.split('/')[1];
		const { title } = pagesByKey[key];
		const records = [] as Record[];
		setState(state => ({ ...state, recordListPage: { title, records } }));
	}

	async function onEnterRecordDetail(_state: State) {
		setState(state => state);
		/*
				// const { type, id } = payload;
		// if (id == null || id === '') {
		setState(state => ({
			...state,
			recordDetailPage: {
				record: { id: '' },
				errors: {},
			},
		}));
		// }
		*/
	}

	return {
		initialize,
		signin, signout, changeSigninDetail,
		onEnterRecordList, onEnterRecordDetail,
	};
};

let _actions: any;
const actions = ({ getState, setState }: StoreSignature) => {
	if (_actions == null) {
		_actions = createActions({ getState, setState });
	}
	return _actions;
};

export {
	customHistory,
	pageGroups, pageGroupByKey, homePage, pages, pagesByKey,
	store, actions,
};
