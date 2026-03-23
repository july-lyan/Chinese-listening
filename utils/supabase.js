// supabase.js
// 简化版Supabase客户端，适配微信小程序

// 从环境变量读取 Supabase 配置
let supabaseUrl = ''
let supabaseKey = ''

// 尝试从环境变量读取
if (process && process.env) {
  supabaseUrl = process.env.Project_URL || ''
  supabaseKey = process.env.Publishable_Key || ''
}

// 如果环境变量中没有，尝试从全局变量读取（微信小程序环境）
if (!supabaseUrl || !supabaseKey) {
  if (typeof global !== 'undefined' && global.process && global.process.env) {
    supabaseUrl = global.process.env.Project_URL || ''
    supabaseKey = global.process.env.Publishable_Key || ''
  }
}

// 默认值，防止环境变量未设置
if (!supabaseUrl) supabaseUrl = 'https://jvukpyjiufkfftrnuqjh.supabase.co'
if (!supabaseKey) supabaseKey = 'sb_publishable_mXFmf7gE96PsYJ_DNSoojA_I7ahV41Y'

function createClient(url = supabaseUrl, key = supabaseKey) {
  return {
    from: (table) => {
      return {
        select: (columns) => {
          return {
            order: (column, options) => {
              return {
                limit: (limit) => {
                  return {
                    async execute() {
                      try {
                        // 构建查询参数
                        const requestData = {};
                        if (columns) requestData.select = columns;
                        if (column) requestData.order = `${column}.${options.ascending ? 'asc' : 'desc'}`;
                        if (limit) requestData.limit = limit;
                        
                        console.log('Supabase请求URL:', `${url}/rest/v1/${table}`);
                        console.log('Supabase请求参数:', requestData);
                        console.log('Supabase请求头:', {
                          'apikey': key,
                          'Authorization': `Bearer ${key}`,
                          'Content-Type': 'application/json'
                        });
                        
                        try {
                          const response = await wx.request({
                            url: `${url}/rest/v1/${table}`,
                            method: 'GET',
                            header: {
                              'apikey': key,
                              'Authorization': `Bearer ${key}`,
                              'Content-Type': 'application/json'
                            },
                            data: requestData
                          });
                          
                          console.log('Supabase响应状态码:', response.statusCode);
                          console.log('Supabase响应数据:', response.data);
                          console.log('Supabase响应头:', response.header);
                          
                          if (response.statusCode === 200) {
                            return { data: response.data, error: null }
                          } else {
                            return { data: null, error: response.data }
                          }
                        } catch (error) {
                          console.error('Supabase请求失败:', error);
                          return { data: null, error: error }
                        }
                      } catch (error) {
                        return { data: null, error: error }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        insert: (data) => {
          return {
            async execute() {
              try {
                const response = await wx.request({
                  url: `${url}/rest/v1/${table}`,
                  method: 'POST',
                  header: {
                    'apikey': key,
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                  },
                  data: data
                })
                
                if (response.statusCode === 201 || response.statusCode === 200) {
                  return { data: response.data, error: null }
                } else {
                  return { data: null, error: response.data }
                }
              } catch (error) {
                return { data: null, error: error }
              }
            }
          }
        }
      }
    }
  }
}

// 导出模块
module.exports = {
  createClient,
  default: createClient(supabaseUrl, supabaseKey)
}