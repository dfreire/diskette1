import * as React from 'react';
import { Table, Button } from 'antd';
import { connect } from 'redux-zero/react';
import { actions } from '../logic';
import { User, Record } from '../types';

interface Props {
	starting: boolean;
	currentUser: User;
	title: string;
	records: Record[];
	onEnterRecordList: { (): void };
}

const columns = [{
	title: 'Name',
	dataIndex: 'name',
}];

class RecordList extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
	}

	componentWillMount() {
		this.props.onEnterRecordList();
	}

	render() {
		const { title, records } = this.props;

		return (
			<div>
				<h1>{title}</h1>
				<Table style={styles.table} dataSource={records} columns={columns} />
				<Button style={styles.button} type="primary">New</Button>
			</div>
		);
	}
}

const styles = {
	table: {
		marginBottom: 10,
	},
	button: {
		width: 100,
	},
};

const mapToProps = ({ starting, currentUser, title, recordListPage }: any) => ({ starting, currentUser, title, ...recordListPage });
export default connect(mapToProps, actions)(RecordList);
