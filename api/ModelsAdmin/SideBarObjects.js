import Request from "../Request";

let url = 'sidebar';

export default {
    methods: {
        async index() {
            let {data} = await Request(url).get();
            return data.data;
        },
        async tree() {
            let {data} = await Request(`${url}/tree`).get();
            return data.data;
        },
        async update(id, item) {
            let {data} = await Request(`${url}/${id}`).put(item);

            return data;
        },
        async delete(id, type) {
            let {data} = await Request(`${url}/${id}`).delete({type});
            return data;
        },
        async create(item) {
            let {data} = await Request(`${url}`).post(item);

            return data;
        },
        async getFirstId() {
            let {data} = await Request(`${url}/first`).get();
            return data.data;
        },
        async languages(id, type) {
            let {data} = await Request(`${url}/${id}/languages`).get({type});
            return data.data;
        },
    }
};