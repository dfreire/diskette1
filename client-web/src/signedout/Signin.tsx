import * as React from 'react';
import { connect } from 'redux-zero/react';
import { actions } from '../logic';
import { Button } from 'antd';

interface Props {
	starting: boolean;
	signin: { (): void };
}

const Signin = (props: Props) => (
	<div>
		<h1>Signin</h1>
		<Button type="primary" onClick={props.signin}>Sign In</Button>
	</div>
);

const mapToProps = ({ starting }: any) => ({ starting });
export default connect(mapToProps, actions)(Signin);
