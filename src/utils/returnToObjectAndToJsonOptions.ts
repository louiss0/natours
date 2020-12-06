import { DocumentToObjectOptions } from "mongoose"

interface ObjectOfDocumentToObjectOptions {
    toObject?: DocumentToObjectOptions
    toJSON?: DocumentToObjectOptions
}

type ToObjectOrToJSONKeys = Array<"toObject" | "toJSON">

export default function returnToObjectAndToJsonOptions(options?: DocumentToObjectOptions, ...keys: ToObjectOrToJSONKeys) {


    const obj: Partial<ObjectOfDocumentToObjectOptions> = {}
    if (options && keys.length !== 0) {

        keys.forEach((key) => {

            obj[key as keyof typeof obj] = options

        })

        return obj

    }

    return {
        toObject: {
            getters: true,
            virtuals: true
        },
        toJSON: {
            getters: true,
            virtuals: true
        }
    }
}




