<template>
  <v-container>
    <v-row class="">
      <v-col class="mb-5" cols="12">
        <v-row justify="center">
          <h1>เว็บจัดการสินค้า DEMO</h1>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <v-row justify="center">
          <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                เพิ่มสินค้า
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">เพิ่มสินค้าใหม่</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="ชื่อสินค้า*"
                        required
                        v-model="nameProduct"
                        :rules="nameProductRule"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="จำนวนสินค้า*"
                        required
                        v-model="amountProduct"
                        :rules="amountRule"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="ราคาสินค้า (ต่อชิ้น)"
                        required
                        v-model="priceProduct"
                        :rules="priceRule"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="dialog = false"
                  >ปิด</v-btn>
                <v-btn color="blue darken-1" text @click="add()">เพิ่ม</v-btn>
              </v-card-actions>
              <v-alert type="error" dismissible :value="alert">
                กรูณาตรวจสอบข้อมูลให้ถูกต้อง
              </v-alert>
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <v-card
          class="mx-auto mt-3"
          max-width="1000"
          dense
          v-for="list in list_product"
          :key="list"
        >
          <v-list-item three-line>
            <v-list-item-content justify="left">
              <v-list-item-title class="headline mb-1">{{
                list.name_product
              }}</v-list-item-title>
              <v-list-item-subtitle
                >จำนวน {{ list.amount }}</v-list-item-subtitle
              >
              <p class="mt-2">ราคา(ชิ้นละ) {{ list.price }} บาท</p>
            </v-list-item-content>
            <v-btn color="warning" @click="edit(list._id)">แก้ไข</v-btn>
            <v-btn color="error" class="ml-5" @click="remove(list._id)">ลบ</v-btn>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialog_edit"
      persistent :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>
          <span class="headline">แก้ไขข้อมูลสินค้า</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="ชื่อสินค้า*"
                  required
                  v-model="nameProduct_edit"
                  :rules="nameProductRule" disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="จำนวนสินค้า*"
                  required
                  v-model="amountProduct_edit"
                  :rules="amountRule"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="ราคาสินค้า (ต่อชิ้น)"
                  required
                  v-model="priceProduct_edit"
                  :rules="priceRule"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog_edit = false"
            >ปิด</v-btn>
          <v-btn color="blue darken-1" text @click="submit_edit(id_edit)">บันทึก</v-btn>
        </v-card-actions>
        <v-alert type="error" dismissible :value="alert">
          กรูณาตรวจสอบข้อมูลให้ถูกต้อง
        </v-alert>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      list_product: null,
      dialog: false,
      dialog_edit: false,
      nameProduct: "",
      amountProduct: "",
      priceProduct: "",

      nameProduct_edit: "",
      amountProduct_edit: "",
      priceProduct_edit: "",
      id_edit: "",

      alert: false,


      nameProductRule: [
        value => !!value || 'กรุณากรอกชื่อสินค้า'
      ],

      amountRule: [
        value => !!value || 'กรุณากรอกจำนวนสินค้า',
        value => value > 0 || 'จำนวนสินค้าไม่ถูกต้อง'
      ],

      priceRule: [
        value => !!value || 'กรุณากรอกราคาสินค้า',
        value => value > 0 || 'ราคาสินค้าไม่ถูกต้อง'
      ]
    };
  },
  mounted() {
    this.fetch(true);
  },
  methods: {
    fetch() {
      this.axios.get('/product').then((result) => {
        this.list_product = result.data;
      });
    },
    add() {

      this.axios.post('/product/add',{
        name_product: this.nameProduct,
        amount: this.amountProduct,
        price: this.priceProduct
      })
        .then(
          this.dialog = false,
          location.reload()
        )
        .catch(() => {
           this.dialog = true
           this.alert = true
           if (this.alert = true) {
             setTimeout(() => this.alert = false, 3000)
           }
        })
    },
    edit(id) {
      this.dialog_edit = true

      this.axios.get(`/product/${id}`)
        .then(result => {
          this.id_edit = result.data[0]._id
          this.nameProduct_edit = result.data[0].name_product
          this.amountProduct_edit = result.data[0].amount
          this.priceProduct_edit = result.data[0].price
        })
    },
    submit_edit(id) {
      this.axios.patch(`/product/${id}`,{
        name_product: this.nameProduct_edit,
        amount: this.amountProduct_edit,
        price: this.priceProduct_edit
      })
        .then(() => {
          location.reload()
          this.dialog_edit = false
        })
    },
    remove(id) {
      this.axios.delete(`/product/${id}`)
        .then(() => {
          location.reload()
        })
    }
  },
};
</script>
