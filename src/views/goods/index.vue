<template>
  <div>
    <!-- 搜索模块 -->
    <el-form :inline="true" ref="searchMap" :model="searchMap" style="margin-top: 20px">
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编码" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          readonly
          @click.native="dialogSupplierVisible = true;"
          v-model="searchMap.supplierName"
          placeholder="商品名称"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="$refs['searchMap'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 商品数据显示模块 -->
    <el-table :data="list" height="500" border style="width: 100%;">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="spec" label="商品规格"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量"></el-table-column>
      <el-table-column prop="supplierName" label="商品"></el-table-column>
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
    <!-- 选择商品弹框 -->
    <el-dialog title="选择商品" :visible.sync="dialogSupplierVisible" width="500px">
      <supplier @option-supplier="optionSupplier" :isDialog="true"></supplier>
    </el-dialog>

    <!-- 弹框，新增(编辑)商品模块 -->
    <el-dialog title="商品编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        :rules="rules"
        style="width: 400px;"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>

        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="商品" prop="supplierName">
          <el-input
            v-model="pojo.supplierName"
            readonly
            @click.native="editOptionSupplier"
            placeholder="选择商品"
          ></el-input>
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
import goodsApi from "@/api/goods";
import Supplier from "../supplier";
export default {
  components: { Supplier },
  data() {
    return {
      list: [],
      total: 0, //总的数据
      currentPage: 1, //当前页码
      pageSize: 10, //一页显示数量
      searchMap: {
        name: "",
        code: "",
        supplierName: ""
      }, //搜索模块表单数据
      dialogSupplierVisible: false, //选择商品弹框开关
      dialogFormVisible: false, //编辑商品弹框开关
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" }
        ]
      },
      pojo: {
        name: "",
        code: "",
        spec: "",
        retailPrice: 0.0,
        purchasePrice: 0.0,
        storageNum: 0,
        supplierName: "",
        supplierId: ""
      },
      isEdit: false //控制弹框中的商品数据填充区域，默认false为填充到搜索模块的选择商品
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      goodsApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          if (resp.flag) {
            this.list = resp.data.rows;
            this.total = resp.data.total;
          } else {
            this.$message({
              type: "error",
              message: resp.message
            });
          }
        });
    },
    handleEdit(id) {
      this.handleAdd();
      goodsApi.getById(id).then(response => {
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
    handleDelete(id) {
      this.$confirm("此操作将删除该商品信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          goodsApi.deleteById(id).then(response => {
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
    //将选择商品的数据填充到表单中
    optionSupplier(currentRow) {
      if (this.isEdit) {
        this.pojo.supplierName = currentRow.name;
        this.pojo.supplierId = currentRow.id;
      } else {
        this.searchMap.supplierName = currentRow.name;
        this.searchMap.supplierId = currentRow.id;
      }
      this.isEdit = false; //还原默认值
      this.dialogSupplierVisible = false;
    },
    //打开商品新增表单
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    //新增弹框中的商品点击事件
    editOptionSupplier() {
      this.isEdit = true; //设置填充到新增表单的选择商品
      this.dialogSupplierVisible = true;
    },
    //提交新增商品数据
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.add(this.pojo).then(response => {
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
    //提交修改后商品信息
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.update(this.pojo).then(response => {
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