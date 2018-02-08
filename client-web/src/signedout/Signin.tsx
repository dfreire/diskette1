import * as React from 'react';
import { connect } from 'redux-zero/react';
import { actions } from '../logic';
import { Card, Form, Input, Icon, Button } from 'antd';

interface Props {
	starting: boolean;
	email: string;
	password: string;

	changeSigninDetail: { (payload: { key: string; value: string }): void };
	signin: { (): void };
}

const Signin = (props: Props) => (
	<div style={{ width: 300, margin: 'auto', paddingBottom: 200 }} >
		<Card title="Diskette" bordered={false} style={{}}>
			<Form layout="vertical">
				<Form.Item>
					<Input
						autoFocus={props.email === ''}
						value={props.email}
						onChange={evt => props.changeSigninDetail({ key: 'email', value: evt.target.value })}
						prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
						placeholder="Email"
					/>
				</Form.Item>
				<Form.Item>
					<Input
						type="password"
						autoFocus={props.email.length > 0 && props.password === ''}
						value={props.password}
						onChange={evt => props.changeSigninDetail({ key: 'password', value: evt.target.value })}
						prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
						placeholder="Password"
					/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" style={{ width: '100%' }} onClick={props.signin}>Sign In</Button>
				</Form.Item>
			</Form>
		</Card>
	</div>
);

const mapToProps = ({ starting, signinPage }: any) => ({ starting, ...signinPage });
export default connect(mapToProps, actions)(Signin);
