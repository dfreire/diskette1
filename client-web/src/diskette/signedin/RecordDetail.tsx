import * as React from 'react';
import { connect } from 'redux-zero/react';
import { actions } from '../logic';
import { User, Record } from '../types';

interface Props {
	starting: boolean;
	currentUser: User;
	title: string;
	record: Record;
	onEnterRecordDetail: { (): void };
}

class RecordDetail extends React.Component<Props, {}> {
	componentWillMount() {
		this.props.onEnterRecordDetail();
	}

	render() {
		const { title, record } = this.props;

		return (
			<div>
				<h1>{title}</h1>
				{JSON.stringify(record)}
			</div>
		);
	}
}

const mapToProps = ({ starting, currentUser, title, recordDetailPage }: any) => ({ starting, currentUser, title, ...recordDetailPage });
export default connect(mapToProps, actions)(RecordDetail);
