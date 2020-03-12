<template>
  <div>
    <!-- 搜索模块 -->
    <el-form :inline="true" ref="searchMap" :model="searchMap" style="margin-top: 20px">
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="账号" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名" style="width: 200px;"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="$refs['searchMap'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 员工数据显示模块 -->
    <el-table :data="list" height="500" border style="width: 100%;">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="username" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="salary" label="薪酬"></el-table-column>
      <el-table-column prop="entryDate" label="入职时间"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页模块 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 弹框，新增(编辑)员工模块 -->
    <el-dialog title="员工编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        :rules="rules"
        style="width: 400px;"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="pojo.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            v-model="pojo.entryDate"
            style="width: 100%;"
          ></el-date-picker>
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
import staffApi from "@/api/staff";
export default {
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1, //当前页
      pageSize: 10, //每页数据量
      searchMap: {
        username: "",
        name: ""
      },
      dialogFormVisible: false,
      pojo: {
        id: null,
        username: "",
        name: "",
        age: "",
        mobile: "",
        salary: "",
        entryDate: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      staffApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          if (resp.flag) {
            this.list = resp.data.rows;
            this.total = resp.data.total;
          } else {
            this.$message({
              message: resp.message,
              type: "warning"
            });
          }
        });
    },
    //编辑
    handleEdit(id) {
      this.handleAdd();
      staffApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        } else {
          this.$message({
            message: resp.message,
            type: "warning"
          });
        }
      });
    },
    //删除
    handleDelete(id) {
      this.$confirm("此操作将删除该员工信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          staffApi.deleteById(id).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
            }
            this.$message({
              type: resp.flag ? "success" : "error",
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
    //每页数据
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    //当前页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffApi.add(this.pojo).then(response => {
            const resp = response.data;
            this.$message({
              type: resp.flag ? "success" : "warning",
              message: resp.message
            });
            if (resp) {
              this.fetchData();
              this.dialogFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffApi.update(this.pojo).then(response => {
            const resp = response.data;

            if (resp.flag) {
              this.dialogFormVisible = false;
              this.fetchData();
              this.pojo.id = null; //还原默认值
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
    }
  }
};
</script>