import request from "@/utils/request";
export default {
    getList() {
        return request({
            url: '/supplier/list',
            method: 'get'
        });
    },
    //分页查询
    search(page, size, searchMap) {
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    //新增供应商
    add(pojo) {
        return request({
            url: '/supplier',
            method: 'post',
            data: pojo
        })
    },
    //根据id查询数据
    getById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'get'
        });
    },
    //提交修改数据
    update(pojo) {
        return request({
            url: `/supplier/${pojo.id}`,
            method: 'put',
            data: pojo
        });
    },
    deleteById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'delete'
        })
    }
}