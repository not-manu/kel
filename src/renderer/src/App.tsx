import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className='p-20 font-[450] antialiased font-sans'>
      Hello World.
    </div>
  )
}

export default App
