import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import APIFeatures, { FilterFields } from '../utils/ApiFeatures';
import { Document, FilterQuery, Model, QueryPopulateOptions } from 'mongoose';
import sendJson from '../utils/sendJson';
import HTTPStatusCodes from '../types/HTTPStatusCodes';
import { Request } from 'express';

export type FilterRequest<T> = Request & {
    filter?: FilterQuery<T>
}

export default abstract class CrudFactory {

    protected static deleteOne = <T extends Document, U extends {}>(Model: Model<T, U>) =>
        catchAsync(async (req, res, next) => {
            const doc = await Model.findByIdAndDelete(req.params.id);

            if (!doc) {
                return next(new AppError('No document found with that ID', 404));
            }



            sendJson(res, {
                status: 'success',
                data: null,
                message: "Document Deleted"
            },
                HTTPStatusCodes.NoContent);
        });

    protected static updateOne = <T extends Document, U extends {}>(Model: Model<T, U>) =>
        catchAsync(async (req, res, next) => {
            const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            if (!doc) {
                return next(new AppError('No document found with that ID', 404));
            }


            sendJson(res, {
                status: 'success',
                message: "Document updated",
                data: {
                    doc
                }
            })
        });

    protected static createOne = <T extends Document, U extends {}>(Model: Model<T, U>) =>
        catchAsync(async (req, res, next) => {


            const doc = await Model.create(req.body)


            if (!doc) {

                return next(new AppError("Could not create a document", HTTPStatusCodes.NoContent))
            }

            sendJson(res, {
                status: 'success',
                message: "Document created",
                data: {
                    doc
                }
            }, HTTPStatusCodes.Created)

        });

    protected static getOne = <T extends Document, U extends {}>
        (Model: Model<T, U>, popOptions: QueryPopulateOptions | null = null) =>
        catchAsync(async (req, res, next) => {
            let query = Model.findById(req.params.id);
            if (popOptions) query = query.populate(popOptions);
            const doc = await query;

            if (!doc) {
                return next(new AppError('No document found with that ID', 404));
            }

            sendJson(res, {
                status: 'success',
                message: "Here is the document",
                data: {
                    doc
                }
            });
        });

    protected static getAll =
        <T extends Document, U extends {}, FilterKeys>(Model: Model<T, U>) =>
            catchAsync(async (req, res, next) => {


                const filterRequest = { ...req } as FilterRequest<FilterKeys>

                const filter = filterRequest.filter ? filterRequest.filter : {}


                const features = new APIFeatures(Model.find(filter), req.query as FilterFields)
                    .filter()
                    .sort()
                    .limitFields()
                    .paginate();

                const docs = await features.$query;

                // SEND RESPONSE


                sendJson(res, {
                    status: 'success',
                    message: "Here are all the documents",
                    results: docs.length,
                    data: {
                        docs
                    }
                })
            });
} 