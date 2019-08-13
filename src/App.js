import React, { Component } from 'react';
import styles from './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {


  state = {
    users: null,
    detailedUsers: [],
    total: null,
    per_page: null,
    current_page: 1
  }


  componentDidMount() {
    this.makeHttpRequestWithPage(1);
  }


  makeHttpRequestWithPage = async pageNumber => {
    const response = await fetch(`https://reqres.in/api/users?page=${pageNumber}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    this.setState({
      users: data.data,
      total: data.total,
      per_page: data.per_page,
      current_page: data.page
    });
  }

  showHideUserDetails = async userId => {
    // check if user fetched earlier if yes then just hide or show
    const existingUserDetail = (this.state.detailedUsers.filter(u => userId === u.id) || []);
    if (existingUserDetail.length > 0) {
      this.setState({
        detailedUsers: this.state.detailedUsers.map(u => {
          u.show = userId === u.id ? !u.show : u.show
          return u
        })
      })
      return;
    }
    // fetch user details from api
    const response = await fetch(`https://reqres.in/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    let user = await response.json();
    // push to existing user details array
    user = user.data
    user.show = true;
    const detailedUsers = this.state.detailedUsers;
    detailedUsers.push(user)
    // udate the state
    this.setState({
      detailedUsers: detailedUsers
    })
  }


  render() {

    let users, renderPageNumbers;

    if (this.state.users !== null) {
      users = this.state.users.map(user => (

          <table class="table">
            <tr onClick={() => this.showHideUserDetails(user.id)}>
              <td>{user.id}</td>
              <td><img src={user.avatar} /></td>
              <td>{user.first_name}</td>
              <td>{this.state.detailedUsers.filter(u => {
                return u.id === user.id && u.show
              }).length > 0 ? '-' : '+'}</td>
            </tr>
            {
              this.state.detailedUsers.length > 0 ? (this.state.detailedUsers.filter(u => {

                return u.id === user.id && u.show
              }).map(u => {
                return (
                  <div class="expanded-details">
                    <div>First Name: {u.first_name}</div>
                    <div>Last Name: {u.last_name}</div>
                    <div>Email ID: {u.email}</div>
                  </div>)
              })) : (<tr></tr>)
            }
          </table>

      ));
    }

    const pageNumbers = [];
    if (this.state.total !== null) {
      for (let i = 1; i <= Math.ceil(this.state.total / this.state.per_page); i++) {
        pageNumbers.push(i);
      }


      renderPageNumbers = pageNumbers.map(number => {
        let classes = this.state.current_page === number ? styles.active : '';

        return (
          <span key={number} className={classes} onClick={() => this.makeHttpRequestWithPage(number)}>{number}</span>
        );
      });
    }

    return (


      <div className={styles.app} class="container center-element">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <table class="table">
                <tr>
                  <th>Sr. No.</th>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>&nbsp;</th>
                </tr>
              </table>
            </thead>
            <tbody className={styles.table}>
              {users}
            </tbody>
          </table>
        </div>
        <nav className={styles.pagination} class="pagination-wrap">
          <ul class="pagination">
            <li class="page-item"> {renderPageNumbers}</li>
          </ul>
        </nav>

      </div>
    );
  }

}

export default App;