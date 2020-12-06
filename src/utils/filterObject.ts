
type UnpackArray<T> = T extends Array<(infer U)>
    ? U
    : never


export default function filterObject<T, K extends keyof T>

    (object: T, ...allowedFields: Array<K>): Readonly<Pick<T, K>> {


    const newObj = {} as Pick<T, UnpackArray<typeof allowedFields>>

    const fieldsArray = [...allowedFields] as Array<string>

    Object
        .keys(object)
        .forEach((key) => {



            if (fieldsArray.includes(key)) {

                newObj[key as keyof typeof newObj] = object[key as keyof typeof newObj]

            }



        })



    return newObj

}
