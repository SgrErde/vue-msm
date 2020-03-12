import request from '@/utils/request';

export default {
    getList() {
        return request({
            url: '/member/list',
            method: 'get'
        });
    },
    //page: 当前页码，  size: 每页查询的条数，  searchMap: 条件查询的条件值
    search(page, size, searchMap) {
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        });
    },
    //新增会员
    add(pojo) {
        return request({
            url: '/member',
            method: 'post',
            data: pojo
        });
    },
    //根据ID查询会员数据
    getById(id) {
        return request({
            url: `/member/${id}`,
            method: 'get'
        });

    },
    //修改会员接口
    update(pojo) {
        return request({
            url: `/member/${pojo.id}`,
            method: 'put',
            data: pojo
        });
    },
    //删除会员
    deleteById(id) {
        return request({
            url: `/member/${id}`,
            method: 'delete'
        });
    }
}