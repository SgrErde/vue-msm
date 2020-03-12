import request from '@/utils/request';
export default {
    //分页查询
    search(page, size, searchMap) {
        return request({
            url: `/staff/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    add(pojo) {
        return request({
            url: '/staff',
            method: 'post',
            data: pojo
        })
    },

    //根据id查询数据
    getById(id) {
        return request({
            url: `/staff/${id}`,
            method: 'get'
        });
    },
    //提交修改数据
    update(pojo) {
        return request({
            url: `/staff/${pojo.id}`,
            method: 'put',
            data: pojo
        });
    },
    deleteById(id) {
        return request({
            url: `/staff/${id}`,
            method: 'delete'
        })
    }
}