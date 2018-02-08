import * as React from 'react';
import { Layout as AntLayout, Row, Col, Menu, Icon, Breadcrumb } from 'antd';
const { Header, Sider, Content } = AntLayout;
import { Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import { Provider, connect } from 'redux-zero/react';
import { store, actions, customHistory } from './logic';
import { User } from './model';
import Signin from './signedout/Signin';
import Home from './signedin/Home';

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
		console.log('_renderSignedOut');
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
		console.log('_renderSignedIn');
		return (
			<AntLayout style={{ height: '100%' }}>
				{this._renderSideBar()}
				<AntLayout style={{ height: '100%' }}>
					{this._renderHeader()}
					{this._renderBreadcrumb()}
					<Content style={{ margin: 20, padding: 20, background: '#fff' }}>
						<Switch>
							<Route path="/home" exact={true} component={Home} />
							<Route component={() => <Redirect to="/home" />} />
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
				width={250}
			>
				<Link to="/">
					<div style={styles.logoContainer[sidebarState]}>
						<img style={styles.logoImg[sidebarState]} src="/diskette.png" alt="" />
					</div>
				</Link>
				<Menu
					theme="dark"
					mode="inline"
					selectedKeys={[this.props.pathname.split('/')[1]]}
				>
					<Menu.Item key="pages">
						<Link to="/pages/">
							<span style={styles.navIcon[sidebarState]}><Icon type="file" /></span>
							<span style={styles.navText[sidebarState]}>Pages</span>
						</Link>
					</Menu.Item>
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
				<Breadcrumb.Item key={'home'}>
					<Link to={'/'}>home</Link>
				</Breadcrumb.Item>
				{this.props.pathname
					.split('/')
					.filter(item => item.length > 0 && item !== 'home')
					.map((item, i) => {
						const url = this.props.pathname.split(item)[0] + item;
						return (
							<Breadcrumb.Item key={i}>
								<Link to={url}>{item}</Link>
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
			margin: 20,
			marginRight: 25,
		},
		collapsed: {
			margin: 10,
			marginTop: 20,
			marginRight: 12,
		},
	},
	logoImg: {
		expanded: {
			width: '100%',
		},
		collapsed: {
			width: '100%',
		},
	},
	navIcon: {
		expanded: {
			display: 'none',
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
