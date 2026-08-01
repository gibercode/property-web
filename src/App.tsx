import { Outlet, useNavigation } from 'react-router'
import { Spinner } from './components/ui/Spinner'

function App() {
  const navigation = useNavigation()

  return (
    <div className="min-h-svh bg-paper text-ink">
      {navigation.state === 'loading' ? (
        <div className="fixed right-4 top-4 z-50 rounded-full border border-line bg-white p-2 shadow-[0_12px_32px_rgba(24,24,27,0.12)]">
          <Spinner label="Cargando ruta" size="sm" />
        </div>
      ) : null}

      <Outlet />
    </div>
  )
}

export default App
