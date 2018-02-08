import createStore from 'redux-zero';
import { Location, Action } from 'history';
import createBrowserHistory from 'history/createBrowserHistory';
import { User } from './model';

const customHistory = createBrowserHistory();

interface State {
	starting: boolean;
	pathname: string;
	currentUser: User;
	loginPage: {
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
	loginPage: {
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

		const email = await localStorage.getItem('loginPage.email');
		const loginPage = { ..._state.loginPage, email: email || '' };

		setState((state) => ({ ...state, loginPage, starting: false }));
	}

	async function signin(_state: State) {
		localStorage.setItem('loginPage.email', _state.loginPage.email);

		setState((state) => ({ ...state, currentUser: { id: '123', email: state.loginPage.email } }));
	}

	async function signout() {
		window.location.href = '/';
	}

	function changeLoginDetail(state: State, payload: { key: string; value: string }): State {
		const loginPage = { ...state.loginPage, [payload.key]: payload.value };
		return { ...state, loginPage };
	}

	return {
		initialize,
		signin, signout, changeLoginDetail,
	};
};

export { store, actions, customHistory };
