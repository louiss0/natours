import { Document, DocumentQuery, Query, } from "mongoose";

export type FilterFields = Record<'page' | 'sort' | 'limit' | 'fields', string>


export default class APIFeatures {

    constructor(
        private query: DocumentQuery<Array<Document>, Document>,
        private queryString: Partial<FilterFields>) {
    }


    get $query() { return this.query }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el as keyof typeof queryObj]);

        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {

        const page = this.queryString.page ? parseInt(this.queryString.page) : 1
        const limit = this.queryString.limit ? parseInt(this.queryString.limit) : 100

        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);


        return this;
    }
}