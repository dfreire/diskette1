import * as React from 'react';
import { Table, Button } from 'antd';
import { connect } from 'redux-zero/react';
import { actions } from '../logic';
import { User, Model } from '../types';

const columns = [{
	title: 'Name',
	dataIndex: 'name',
}];

interface Props {
	starting: boolean;
	currentUser: User;
	records: Model[];
}

const FrontendModels = (props: Props) => (
	<div>
		<h1>Page Models</h1>
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

const mapToProps = ({ starting, currentUser, modelListPage }: any) => ({ starting, currentUser, ...modelListPage });
export default connect(mapToProps, actions)(FrontendModels);
