import * as React from 'react';
import { connect } from 'redux-zero/react';
import { actions } from '../logic';
import { User } from '../types';

interface Props {
	starting: boolean;
	currentUser: User;
}

const FrontendUsers = (props: Props) => (
	<div>
		<h1>FrontendUsers</h1>
		{props.currentUser.email}
	</div>
);

const mapToProps = ({ starting, currentUser }: any) => ({ starting, currentUser });
export default connect(mapToProps, actions)(FrontendUsers);
