<template>
  <div>
    <!-- 搜索模块 -->
    <el-form :inline="true" ref="searchMap" :model="searchMap" style="margin-top: 20px">
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员姓名" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型" style="width: 120px;">
          <el-option
            :key="item.type"
            v-for="item in payTypeOptions"
            :label="item.name"
            :value="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          v-model="searchMap.birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          style="width: 180px;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchMap')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 会员数据显示区域 -->
    <el-table :data="list" height="700" border style="width: 100%;">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
      <el-table-column prop="name" label="会员姓名" width="100"></el-table-column>
      <el-table-column prop="birthday" label="会员生日"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column prop="integral" label="可用积分"></el-table-column>
      <el-table-column prop="money" label="开卡金额"></el-table-column>
      <el-table-column prop="payType" label="支付类型" width="90">
        <template slot-scope="scope">{{scope.row.payType | payTypeFilter()}}</template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址"></el-table-column>
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
    <!-- 弹框，新增(编辑)会员模块 -->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        :rules="rules"
        style="width: 400px;"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            v-model="pojo.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="会员生日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="支付类型">
            <el-option
              :key="item.type"
              v-for="item in payTypeOptions"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input v-model="pojo.address" type="textarea" :rows="2" placeholder="会员地址"></el-input>
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
import memberApi from "@/api/member";
const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];
export default {
  data: function() {
    return {
      list: [],
      total: 0, //数据总数
      currentPage: 1, //当前页码
      pageSize: 10, //每页的数据数量
      searchMap: {
        //搜索内容的数据
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      },
      payTypeOptions, //支付类型的选项
      dialogFormVisible: false, //控制新增表单弹框
      pojo: {
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        integral: "",
        money: "",
        payType: "",
        address: ""
      }, //新增表单数据
      rules: {
        //表单校验
        cardNum: [
          { required: true, message: "会员卡号不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "会员姓名不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" }
        ],
        payType: [
          { required: true, message: "支付类型不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.list = resp.data.rows;

          this.total = resp.data.total;
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
    //重置搜索模块
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //新增会员
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.dialogFormVisible = false;
              this.fetchData();
              this.$message({
                showClose: true,
                message: resp.message,
                type: "success"
              });
            } else {
              this.$message({
                showClose: true,
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //重置新增表单
    handleAdd() {
      this.dialogFormVisible = true;

      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    //更新会员信息
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.update(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.dialogFormVisible = false;
              this.fetchData();
              this.pojo.id = null;
              this.$message({
                showClose: true,
                message: resp.message,
                type: "success"
              });
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //编辑会员信息
    handleEdit(id) {
      this.handleAdd();

      memberApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        } else {
          this.$message({
            message: "获取会员信息失败",
            type: "warning"
          });
        }
      });
    },
    //删除会员信息
    handleDelete(id) {
      this.$confirm("此操作将删除该会员信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          memberApi.deleteById(id).then(response => {
            const resp = response.data;
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
            if (resp.flag) {
              this.fetchData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  filters: {
    payTypeFilter(type) {
      const payObj = payTypeOptions.find(obj => obj.type === type);
      return payObj ? payObj.name : null;
    }
  }
};
</script>
