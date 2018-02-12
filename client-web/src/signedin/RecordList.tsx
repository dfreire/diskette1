import * as React from 'react';
import { Table, Button } from 'antd';
import { connect } from 'redux-zero/react';
import { actions } from '../logic';
import { User, Record } from '../types';

interface Props {
	starting: boolean;
	currentUser: User;
	records: Record[];
}

const columns = [{
	title: 'Name',
	dataIndex: 'name',
}];

const RecordList = (props: Props) => (
	<div>
		<h1>RecordList</h1>
		<Table style={styles.table} dataSource={props.records} columns={columns} />
		<Button style={styles.button} type="primary">New</Button>
	</div>
);

const styles = {
	table: {
		marginBottom: 10,
	},
	button: {
		width: 100,
	},
};

const mapToProps = ({ starting, currentUser, recordListPage }: any) => ({ starting, currentUser, ...recordListPage });
export default connect(mapToProps, actions)(RecordList);
