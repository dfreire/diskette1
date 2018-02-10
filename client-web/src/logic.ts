import createStore from 'redux-zero';
import { Location, Action } from 'history';
import createBrowserHistory from 'history/createBrowserHistory';
import { Record, User, Model } from './types';

const customHistory = createBrowserHistory();

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
		records: Record[];
	};
	recordDetailPage: {
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
		records: [],
	},
	recordDetailPage: {
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

	async function openRecordDetail(_state: State, payload: { type: string; id?: string }) {
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
	}

	return {
		initialize,
		signin, signout, changeSigninDetail,
		openRecordDetail,
	};
};

let _actions: any;
const actions = ({ getState, setState }: StoreSignature) => {
	if (_actions == null) {
		_actions = createActions({ getState, setState });
	}
	return _actions;
};

export { store, actions, customHistory };
