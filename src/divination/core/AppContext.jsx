import { createContext, useContext, useState } from 'react'
import { ASSERTION_CONFIG } from '../domain/assertion.js'
import { bookDefaultMethod } from '../books/registry.js'

const Ctx = createContext(null)

export function AppProvider({ children, methods, datasources, layoutConfig }) {
  const [methodId, setMethodId] = useState(Object.keys(methods)[0])
  const [dataSourceId, setDataSourceId] = useState(Object.keys(datasources)[0])
  const [options, setOptions] = useState({})
  const [result, setResult] = useState(null)
  const [layout, setLayout] = useState(layoutConfig)
  const [selected, setSelected] = useState(null)
  const [intent, setIntent] = useState('general')
  const [classic, setClassic] = useState('meihua')
  const [decisiveLevels, setDecisiveLevels] = useState(ASSERTION_CONFIG.decisiveLevels)
  const [waixing, setWaixing] = useState('')
  const [waixingJi, setWaixingJi] = useState('中性')
  const [selectedBook, setSelectedBook] = useState('meihua')

  const method = methods[methodId]
  const dataSource = datasources[dataSourceId]

  const run = (opts) => {
    setOptions(opts || {})
    setResult(method.run(opts || {}))
  }

  // 切换方法：重置选项并清空结果（回到「未排盘」，等用户点排盘）
  const switchMethod = (id) => {
    setMethodId(id)
    setOptions({})
    setResult(null)
    setSelected(null)
  }

  // 重置：清空结果与选项，回到「未排盘」状态（仅显示排盘模块）
  const reset = () => {
    setOptions({})
    setResult(null)
    setSelected(null)
  }

  // 选书箱：设书箱 + 切到其默认占断方法（清空结果，等用户点排盘）
  const selectBook = (bookId) => {
    setSelectedBook(bookId)
    setMethodId(bookDefaultMethod(bookId))
    setOptions({})
    setResult(null)
    setSelected(null)
  }

  const value = {
    methodId, setMethodId, switchMethod, reset,
    selectedBook, setSelectedBook, selectBook,
    dataSourceId, setDataSourceId,
    options, setOptions,
    result, run,
    layout, setLayout,
    selected, setSelected,
    intent, setIntent,
    classic, setClassic,
    decisiveLevels, setDecisiveLevels,
    waixing, setWaixing, waixingJi, setWaixingJi,
    method, dataSource,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useApp = () => useContext(Ctx)
