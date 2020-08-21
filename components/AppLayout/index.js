import styles, { globalstyles } from './styles'
export default function AppLayout ({ children }) {
  return (
    <>
      <div>
        <main>
          {children}
        </main>
      </div>

      <style jsx>{styles}</style>

      <style jsx global>{globalstyles}</style>
    </>
  )
}
