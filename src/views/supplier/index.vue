<template>
  <div>
    <!-- 搜索模块 -->
    <el-form :inline="true" ref="searchMap" :model="searchMap" style="margin-top: 20px">
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item prop="linkman">
        <el-input
          v-model="searchMap.linkman"
          placeholder="联系人"
          style="width: 200px;"
          v-if="!isDialog"
        ></el-input>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input
          v-model="searchMap.mobile"
          placeholder="联系电话"
          style="width: 200px;"
          v-if="!isDialog"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd" v-if="!isDialog">新增</el-button>
        <el-button @click="resetForm('searchMap')" v-if="!isDialog">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 供应商数据显示模块 -->
    <el-table
      :highlight-current-row="isDialog"
      @current-change="clickCurrentChange"
      :data="list"
      height="500"
      border
      style="width: 100%;"
    >
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人姓名"></el-table-column>
      <el-table-column prop="mobile" label="联系电话"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="150" v-if="!isDialog">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页模块 -->
    <el-pagination
      :layout=" !isDialog?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      :total="total"
    ></el-pagination>
    <!-- 弹框，新增(编辑)供应商模块 -->
    <el-dialog v-if="!isDialog" title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        :rules="rules"
        style="width: 400px;"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="linkman">
          <el-input v-model="pojo.linkman"></el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="pojo.remark" type="textarea" :rows="2" placeholder="请输入备注……"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- addData()传入的参数是el-form表单中的ref属性值 -->
        <el-button
          type="primary"
          @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import supplierApi from "@/api/supplier";
export default {
  props: {
    isDialog: Boolean
  },
  data() {
    return {
      list: [],
      total: 0, //总的数据
      currentPage: 1, //当前页码
      pageSize: 10, //一页显示数量
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      }, //搜索模块表单数据
      dialogFormVisible: false,
      pojo: {
        id: null,
        name: "",
        linkman: "",
        mobile: "",
        remark: ""
      }, //新增表单数据
      rules: {
        name: [{ required: true, message: "供应商不能为空", trigger: "blur" }],
        linkman: [
          { required: true, message: "联系人姓名不能为空", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      supplierApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          if (resp.flag) {
            this.total = resp.data.total;
            this.list = resp.data.rows;
          } else {
            this.$message({
              type: "error",
              message: resp.message
            });
          }
        });
    },
    //编辑操作
    handleEdit(id) {
      this.handleAdd();
      supplierApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        } else {
          this.$message({
            type: "warning",
            message: resp.message
          });
        }
      });
    },
    //删除操作
    handleDelete(id) {
      this.$confirm("此操作将删除该供应商信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          supplierApi.deleteById(id).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
            }
            this.$message({
              type: resp.flag ? "success" : "eeror",
              message: resp.message
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    //重置搜索模块表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //打开供应商新增表单
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    //提交新增供应商数据
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.add(this.pojo).then(response => {
            const resp = response.data;

            if (resp.flag) {
              this.dialogFormVisible = false;
              this.fetchData();
            }
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
          });
        } else {
          return false;
        }
      });
    },
    //提升修改数据
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.update(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.dialogFormVisible = false;
              this.fetchData();
              this.pojo.id = null;
            }
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
          });
        } else {
          return false;
        }
      });
    },
    //表格单行点击事件
    clickCurrentChange(currentRow) {
      this.$emit("option-supplier", currentRow);
    }
  }
};
</script>