<template>
  <div>
    <v-simple-table v-if="company_item">
      <template v-slot:default>
        <tbody>
          <tr
            v-for="row in company_keys"
            :key="row.key"
          >
            <td class="font-weight-bold">
              {{ row.title }}
            </td>
            <td>
              <div v-html="company_item ? company_item[row.key] : ''" />
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
    export default {
        name: "Company",
        props: {
            companyId: {
                type: [Number, String],
                required: false,
                default: () => {
                    return 0;
                }
            },
            companyItem: {
                type: Object,
                required: false,
                default: () => {
                    return {};
                }
            }
        },
        data () {
            return {
                company_keys: [
                    {key:'title',title:'Название'},
                    {key:'inn',title:'ИНН'},
                    {key:'kpp',title:'КПП'},
                    {key:'description',title:'Комментарий'},
                ],
                company_item: false,
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            async loadData(){
                if(this.companyId){
                  try {
                    let {data} = (await this.$api.Company.page( this.companyId)).data;
                    this.company_item = data.company;
                  }catch{
                    this.$store.commit('setSnackParams', {
                      text: 'Ошибка при получении информации о компании',
                      color: 'error'
                    });
                  }
                } else if(this.companyItem) {
                    this.company_item = Object.assign(this.company_item, this.companyItem);
                }
            },
        }



    }
</script>

<style scoped>

</style>