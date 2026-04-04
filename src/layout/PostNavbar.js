import { Link } from 'react-router-dom';
export default function PostNavbar() {
    
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
  <div className="container-fluid d-flex gap-2">
    <Link className="btn btn-outline-light" style={{marginLeft: "5%", width:"20%"}} to="/writeBlogs">Write Your Blogs</Link>
    <h3 className="fs-4 mt-3" style={{ fontFamily: "monospace", marginLeft: "10%", textDecoration:"overline" }}>
          Universal Blog Portal - Read & Share
        </h3>
    <Link className="btn btn-outline-light ms-auto" style={{marginRight: "5%", width:"20%"}} to="/viewBlogs">Read & Share</Link>
  </div>
</nav>
    </div>
  )
}
