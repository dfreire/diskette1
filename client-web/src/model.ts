export interface User {
	id: string;
	email: string;
}

export interface Page {
	id: string;
	modelId: string;
	title: string;
	metaDescription: string;
	metaKeywords: string;
	slug: string;
	pageIds: string[];
	redirectToId?: string;
}

export interface PageModel {
	id: string;
	title: string;
	fields: Field[];
}

export interface Field {
	type: 'text' | 'number' | 'boolean' | 'date' | 'url' | 'tags' | 'file' | 'options' | 'collection' | 'fieldlist';
	key: string;
	title?: string;
	helpText?: string;
}

export interface TextField extends Field {
	type: 'text';
	value: string;
}

export interface NumberField extends Field {
	type: 'number';
	value: number;
}

export interface BooleanField extends Field {
	type: 'boolean';
	value: boolean;
}

export interface DateField extends Field {
	type: 'date';
	value: number;
}

export interface UrlField extends Field {
	type: 'url';
	value: string;
}

export interface TagsField extends Field {
	type: 'tags';
	value: string[];
}

export interface FileField extends Field {
	type: 'file';
	value: string;
	extensions: string[];
}

export interface SelectField extends Field {
	selectionMode: number | 'single' | 'multiple';
	display: 'radio' | 'check' | 'select' | 'combo' | 'transfer';
	value: string[];
}

export interface OptionsField extends SelectField {
	type: 'options';
	options: {
		key: string;
		title: string;
		value: boolean | number | string;
	}[];
}

export interface CollectionField extends SelectField {
	type: 'collection';
	keyField: string;
	titleField: string;
	valueField: string;
}

export interface FieldList extends Field {
	type: 'fieldlist';
	minNumOfItems?: number;
	maxNumOfItems?: number;
	canSort: boolean;
	fields: Field[];
	values: { [fieldKey: string]: boolean | number | string };
}
