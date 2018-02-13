import 'antd/dist/antd.css';
import './Root.css';
import * as React from 'react';
import { Layout as AntLayout, Row, Col, Menu, Icon, Breadcrumb } from 'antd';
const { Header, Sider, Content } = AntLayout;
import { Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import { Provider, connect } from 'redux-zero/react';
import { store, actions, customHistory, pageGroupByKey, homePage, pages, pagesByKey } from './logic';
import { User } from './types';
import Signin from './signedout/Signin';
import Home from './signedin/Home';
import FrontendPages from './signedin/FrontendPages';
import RecordList from './signedin/RecordList';
import FrontendFiles from './signedin/FrontendFiles';
import FrontendCollections from './signedin/FrontendCollections';
import FrontendUsers from './signedin/FrontendUsers';
import FrontendEmails from './signedin/FrontendEmails';
import FrontendTranslations from './signedin/FrontendTranslations';
import FrontendSettings from './signedin/FrontendSettings';
import BackendUsers from './signedin/BackendUsers';
import BackendEmails from './signedin/BackendEmails';
import BackendSettings from './signedin/BackendSettings';

const componentByPageKey = {
	[pagesByKey.a_pages.key]: FrontendPages,
	[pagesByKey.a_models.key]: RecordList,
	[pagesByKey.a_files.key]: FrontendFiles,
	[pagesByKey.a_collections.key]: FrontendCollections,
	[pagesByKey.a_users.key]: FrontendUsers,
	[pagesByKey.a_emails.key]: FrontendEmails,
	[pagesByKey.a_translations.key]: FrontendTranslations,
	[pagesByKey.a_settings.key]: FrontendSettings,
	[pagesByKey.b_users.key]: BackendUsers,
	[pagesByKey.b_emails.key]: BackendEmails,
	[pagesByKey.b_settings.key]: BackendSettings,
};

interface Props {
	starting: boolean;
	pathname: string;
	currentUser: User;
	initialize: { (): void };
	signout: { (): void };
}

interface State {
	collapsedSidebar: boolean;
}

class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			collapsedSidebar: false,
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
					? this._renderSignedin()
					: this._renderSignedout()
				}
			</Router>
		);
	}

	_renderSignedout() {
		return (
			<AntLayout style={{ height: '100%' }}>
				<Switch>
					<Route path="/signin" exact={true} component={Signin} />
					<Route component={() => <Redirect to="/signin" />} />
				</Switch>
			</AntLayout>
		);
	}

	_renderSignedin() {
		return (
			<AntLayout style={{ height: '100%' }}>
				{this._renderSidebar()}
				<AntLayout style={{ height: '100%' }}>
					{this._renderHeader()}
					{this._renderBreadcrumb()}
					<Content style={{ margin: 20, padding: 20, background: '#fff' }}>
						{this._renderRoutes()}
					</Content>
				</AntLayout>
			</AntLayout>
		);
	}

	_renderSidebar() {
		const sidebarState = this.state.collapsedSidebar ? 'collapsed' : 'expanded';

		return (
			<Sider
				trigger={null}
				collapsible={true}
				collapsed={this.state.collapsedSidebar}
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
								<Link to={`/${p.key}`}>
									<span style={styles.navIcon[sidebarState]}><Icon type={p.icon} /></span>
									<span style={styles.navText[sidebarState]}>{p.title}</span>
								</Link>
							</Menu.Item>
						))}
					</Menu.SubMenu>
					<Menu.SubMenu key={pageGroupByKey.backend.key} title={<span><Icon type={pageGroupByKey.backend.icon} /><span>{pageGroupByKey.backend.title}</span></span>}>
						{pages.filter(p => p.group === pageGroupByKey.backend).map(p => (
							<Menu.Item key={p.key}>
								<Link to={`/${p.key}`}>
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
							type={this.state.collapsedSidebar ? 'menu-unfold' : 'menu-fold'}
							onClick={this._onToggleSidebar}
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
					<Link to={`/${homePage.key}`}>{homePage.title}</Link>
				</Breadcrumb.Item>
				{this.props.pathname
					.split('/')
					.filter(token => token.length > 0 && token !== homePage.key)
					.map((token, i) => {
						const url = this.props.pathname.split(token)[0] + token;
						const page = pagesByKey[token];
						const title = page != null
							? page.title
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

	_renderRoutes() {
		return (
			<Switch>
				<Route key={homePage.key} path={`/${homePage.key}`} exact={true} component={Home} />
				{pages.map(p => <Route key={p.key} path={`/${p.key}`} exact={true} component={componentByPageKey[p.key]} />)}
				<Route component={() => <Redirect to={`/${homePage.key}`} />} />
			</Switch>
		);
	}

	_onToggleSidebar = () => {
		this.setState({
			collapsedSidebar: !this.state.collapsedSidebar,
		});
	}
}

const styles = {
	logoContainer: {
		expanded: {
			backgroundColor: '#072449',
			padding: '30px 20px',
		},
		collapsed: {
			backgroundColor: '#072449',
			padding: '30px 20px',
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
