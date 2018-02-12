import * as React from 'react';
import { connect } from 'redux-zero/react';
import { actions } from '../logic';
import { User, Record } from '../types';

interface Props {
	starting: boolean;
	currentUser: User;
	record: Record;
}

const RecordDetail = (props: Props) => (
	<div>
		<h1>RecordDetail</h1>
		{JSON.stringify(props.record)}
	</div>
);

const mapToProps = ({ starting, currentUser, recordDetailPage }: any) => ({ starting, currentUser, ...recordDetailPage });
export default connect(mapToProps, actions)(RecordDetail);
