import * as _ from 'underscore';
import * as React from 'react';
import { Layout as AntLayout, Row, Col, Menu, Icon, Breadcrumb } from 'antd';
const { Header, Sider, Content } = AntLayout;
import { Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import { Provider, connect } from 'redux-zero/react';
import { store, actions, customHistory } from './logic';
import { User } from './model';
import Signin from './signedout/Signin';
import Home from './signedin/Home';
import FrontendPages from './signedin/FrontendPages';
import FrontendModels from './signedin/FrontendModels';
import FrontendFiles from './signedin/FrontendFiles';
import FrontendCollections from './signedin/FrontendCollections';
import FrontendUsers from './signedin/FrontendUsers';
import FrontendEmails from './signedin/FrontendEmails';
import FrontendTranslations from './signedin/FrontendTranslations';
import FrontendSettings from './signedin/FrontendSettings';
import BackendUsers from './signedin/BackendUsers';
import BackendEmails from './signedin/BackendEmails';
import BackendSettings from './signedin/BackendSettings';

const pageGroups = [
	{ key: 'frontend', title: 'Frontend', icon: 'laptop' },
	{ key: 'backend', title: 'Backend', icon: 'desktop' },
];

const pageGroupByKey = _.indexBy(pageGroups, 'key');

const homePage = { key: 'home', title: 'Home', component: Home };

const pages = [
	{ key: 'pages', group: pageGroupByKey.frontend, title: 'Pages', icon: 'file', component: FrontendPages },
	{ key: 'models', group: pageGroupByKey.frontend, title: 'Models', icon: 'file-text', component: FrontendModels },
	{ key: 'files', group: pageGroupByKey.frontend, title: 'Files', icon: 'hdd', component: FrontendFiles },
	{ key: 'collections', group: pageGroupByKey.frontend, title: 'Collections', icon: 'table', component: FrontendCollections },
	{ key: 'fusers', group: pageGroupByKey.frontend, title: 'Users', icon: 'team', component: FrontendUsers },
	{ key: 'femails', group: pageGroupByKey.frontend, title: 'Emails', icon: 'mail', component: FrontendEmails },
	{ key: 'translations', group: pageGroupByKey.frontend, title: 'Translations', icon: 'customer-service', component: FrontendTranslations },
	{ key: 'fsettings', group: pageGroupByKey.frontend, title: 'Settings', icon: 'setting', component: FrontendSettings },
	{ key: 'busers', group: pageGroupByKey.backend, title: 'Users', icon: 'team', component: BackendUsers },
	{ key: 'bemails', group: pageGroupByKey.backend, title: 'Emails', icon: 'mail', component: BackendEmails },
	{ key: 'bsettings', group: pageGroupByKey.backend, title: 'Settings', icon: 'setting', component: BackendSettings },
];

const pagesByKey = _.indexBy(pages, 'key');

interface Props {
	starting: boolean;
	pathname: string;
	currentUser: User;
	initialize: { (): void };
	signout: { (): void };
}

interface State {
	collapsedSideBar: boolean;
}

class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			collapsedSideBar: false,
		};
	}

	componentWillMount() {
		this.props.initialize();
	}

	render() {
		const { starting, currentUser } = this.props;

		return starting === false && (
			<Router history={customHistory}>
				{currentUser.id != null && currentUser.id.length > 0
					? this._renderSignedIn()
					: this._renderSignedOut()
				}
			</Router>
		);
	}

	_renderSignedOut() {
		return (
			<AntLayout style={{ height: '100%' }}>
				<Switch>
					<Route path="/signin" exact={true} component={Signin} />
					<Route component={() => <Redirect to="/signin" />} />
				</Switch>
			</AntLayout>
		);
	}

	_renderSignedIn() {
		return (
			<AntLayout style={{ height: '100%' }}>
				{this._renderSideBar()}
				<AntLayout style={{ height: '100%' }}>
					{this._renderHeader()}
					{this._renderBreadcrumb()}
					<Content style={{ margin: 20, padding: 20, background: '#fff' }}>
						<Switch>
							<Route key={homePage.key} path={`/${homePage.key}`} exact={true} component={homePage.component} />
							{pages.map(p => <Route key={p.key} path={`/${p.key}`} exact={true} component={p.component} />)}
							<Route component={() => <Redirect to={`/${homePage.key}/`} />} />
						</Switch>
					</Content>
				</AntLayout>
			</AntLayout>
		);
	}

	_renderSideBar() {
		const sidebarState = this.state.collapsedSideBar ? 'collapsed' : 'expanded';

		return (
			<Sider
				trigger={null}
				collapsible={true}
				collapsed={this.state.collapsedSideBar}
				style={{ height: '100%' }}
				width={240}
			>
				<Link to={`/${homePage.key}/`}>
					<div style={styles.logoContainer[sidebarState]}>
						<img
							style={styles.logoImg[sidebarState]}
							src={sidebarState === 'expanded' ? '/diskette.png' : '/d-iskette.png'}
							alt=""
						/>
					</div>
				</Link>
				<Menu
					theme="dark"
					mode="inline"
					selectedKeys={[this.props.pathname.split('/')[1]]}
					defaultOpenKeys={[pageGroupByKey.frontend.key, pageGroupByKey.backend.key]}
				>
					<Menu.SubMenu key={pageGroupByKey.frontend.key} title={<span><Icon type={pageGroupByKey.frontend.icon} /><span>{pageGroupByKey.frontend.title}</span></span>}>
						{pages.filter(p => p.group === pageGroupByKey.frontend).map(p => (
							<Menu.Item key={p.key}>
								<Link to={`/${p.key}/`}>
									<span style={styles.navIcon[sidebarState]}><Icon type={p.icon} /></span>
									<span style={styles.navText[sidebarState]}>{p.title}</span>
								</Link>
							</Menu.Item>
						))}
					</Menu.SubMenu>
					<Menu.SubMenu key={pageGroupByKey.backend.key} title={<span><Icon type={pageGroupByKey.backend.icon} /><span>{pageGroupByKey.backend.title}</span></span>}>
						{pages.filter(p => p.group === pageGroupByKey.backend).map(p => (
							<Menu.Item key={p.key}>
								<Link to={`/${p.key}/`}>
									<span style={styles.navIcon[sidebarState]}><Icon type={p.icon} /></span>
									<span style={styles.navText[sidebarState]}>{p.title}</span>
								</Link>
							</Menu.Item>
						))}
					</Menu.SubMenu>
				</Menu>
			</Sider>
		);
	}

	_renderHeader() {
		return (
			<Header style={{ background: '#fff', padding: 0 }}>
				<Row>
					<Col span={12}>
						<Icon
							className="trigger"
							type={this.state.collapsedSideBar ? 'menu-unfold' : 'menu-fold'}
							onClick={this._onToggleSideBar}
							style={{ margin: '24px 20px', fontSize: 20, cursor: 'pointer' }}
						/>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Icon
							className="trigger"
							type="logout"
							onClick={this.props.signout}
							style={{ margin: '24px 20px', fontSize: 20, cursor: 'pointer' }}
						/>
					</Col>
				</Row>
			</Header>
		);
	}

	_renderBreadcrumb() {
		return (
			<Breadcrumb style={{ marginTop: 20, marginLeft: 20 }}>
				<Breadcrumb.Item key={homePage.key}>
					<Link to={'/'}>{homePage.title}</Link>
				</Breadcrumb.Item>
				{this.props.pathname
					.split('/')
					.filter(token => token.length > 0 && token !== homePage.key)
					.map((token, i) => {
						const url = this.props.pathname.split(token)[0] + token;
						const page = pagesByKey[token];
						const title = page != null
							? `${page.group.title} ${page.title}`
							: this.props.pathname.split(token)[0] + token;
						return (
							<Breadcrumb.Item key={i}>
								<Link to={url}>{title}</Link>
							</Breadcrumb.Item>
						);
					})
				}
			</Breadcrumb>
		);
	}

	_onToggleSideBar = () => {
		this.setState({
			collapsedSideBar: !this.state.collapsedSideBar,
		});
	}
}

const styles = {
	logoContainer: {
		expanded: {
			backgroundColor: '#072449',
			padding: 20,
		},
		collapsed: {
			backgroundColor: '#072449',
			padding: 20,
		},
	},
	logoImg: {
		expanded: {
			height: 40,
		},
		collapsed: {
			height: 40,
		},
	},
	navIcon: {
		expanded: {
		},
		collapsed: {
			textAlign: 'center',
		},
	},
	navText: {
		expanded: {
		},
		collapsed: {
			display: 'none',
		},
	},
};

const AppWrapper = connect(({ starting, pathname, currentUser }: any) => ({ starting, pathname, currentUser }), actions)(App);

export default () => (
	<Provider store={store}>
		<AppWrapper />
	</Provider>
);
