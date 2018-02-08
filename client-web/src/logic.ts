import createStore from 'redux-zero';
import { Location, Action } from 'history';
import createBrowserHistory from 'history/createBrowserHistory';
import { User } from './model';

const customHistory = createBrowserHistory();

interface State {
	starting: boolean;
	pathname: string;
	currentUser: User;
}

const INITIAL_STATE: State = {
	starting: true,
	pathname: '',
	currentUser: {
		id: '',
		email: '',
	},
};

const store = createStore(INITIAL_STATE);

interface StoreSignature {
	getState: { (): State };
	setState: { (callback: { (state: State): State }): void };
}

const actions = ({ getState, setState }: StoreSignature) => {
	async function initialize() {
		customHistory.listen((location: Location, action: Action) => {
			setState((state) => ({ ...state, pathname: location.pathname }));
		});

		setState((state) => ({ ...state, starting: false }));
	}

	async function signin() {
		setState((state) => ({ ...state, currentUser: { id: '123', email: 'user@mail.com' } }));
	}

	async function signout() {
		setState((state) => ({ ...INITIAL_STATE, starting: false }));
	}

	return {
		initialize,
		signin, signout,
	};
};

export { store, actions, customHistory };
