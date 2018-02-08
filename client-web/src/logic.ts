import createStore from 'redux-zero';
import { Location, Action } from 'history';
import createBrowserHistory from 'history/createBrowserHistory';
import { User } from './model';

const customHistory = createBrowserHistory();

interface State {
	starting: boolean;
	pathname: string;
	currentUser: User;
	signinPage: {
		email: string;
		password: string;
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
	},
};

const store = createStore(INITIAL_STATE);

interface StoreSignature {
	getState: { (): State };
	setState: { (callback: { (state: State): State }): void };
}

const actions = ({ getState, setState }: StoreSignature) => {
	async function initialize(_state: State) {
		customHistory.listen((location: Location, action: Action) => {
			setState((state) => ({ ...state, pathname: location.pathname }));
		});

		const email = await localStorage.getItem('signinPage.email');
		const signinPage = { ..._state.signinPage, email: email || '' };

		setState((state) => ({ ...state, signinPage, starting: false }));
	}

	async function signin(_state: State) {
		localStorage.setItem('signinPage.email', _state.signinPage.email);

		setState((state) => ({ ...state, currentUser: { id: '123', email: state.signinPage.email } }));
	}

	async function signout() {
		window.location.href = '/';
	}

	function changeSigninDetail(state: State, payload: { key: string; value: string }): State {
		const signinPage = { ...state.signinPage, [payload.key]: payload.value };
		return { ...state, signinPage };
	}

	return {
		initialize,
		signin, signout, changeSigninDetail,
	};
};

export { store, actions, customHistory };
