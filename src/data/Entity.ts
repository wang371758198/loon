import {DataContainer} from "./DataContainer";
import {TypedModel} from "./TypedModel";

export class Entity<T> {

    private model: T;

    constructor(model: T) {
        this.model = model;
    }

    public table(): string|undefined {
        return DataContainer.getTableName(this.model);
    }

    public modelColumns(): any[] {
        return DataContainer.getColumns(this.model);
    }

    public columns(): string[] {
        return this.modelColumns()
            .map(item => `${this.table()}.${item.columnName} AS ${this.table()}.${item.columnName}`);
    }

    public column(property: string): string|undefined {
        const modelColumn = this.modelColumns().find(item => item.propertyName === property);
        if (typeof modelColumn !== 'undefined') {
            return `${this.table()}.${modelColumn.columnName}`;
        }
    }

    public fromDB<T extends TypedModel>(type: { new(...args): T}, data: any): T {

        const instance = new type();

        for (let column in data) {
            if (data.hasOwnProperty(column)) {
                const value = data[column];
                const columnName = column.split(`${this.table()}.`)[1];
                const modelColumn = this.modelColumns().find(item => item.columnName === columnName);
                if (typeof modelColumn !== 'undefined') {
                    instance[modelColumn.propertyName] = value;
                }
            }
        }

        return instance;
    }
}

