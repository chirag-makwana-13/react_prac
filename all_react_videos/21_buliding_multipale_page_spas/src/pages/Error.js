import MainNavigation from "../components/MainNavigation"

function ErrorPage(){
  return(
    <>  
      <MainNavigation/>
      <main>
      <h1>Error Occured!</h1>
      <p>Could not find a page.</p>
      </main>
      
    </>
  )
}
export default ErrorPage