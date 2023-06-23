import React from 'react'
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
function AllUsers(props) {

    const all_user_data = props.data.all_user_data;
    const username = props.data.username;
    // console.log("Apidata props = ", props);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortAttribute, setSortAttribute] = useState('');

    // Calculate the index range for the current page
    const startIndex = (currentPage - 1) * 30;
    const endIndex = startIndex + 30;

    // Filter the data based on the search term
    const filteredData = all_user_data.filter((post) =>
        post.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle sort attribute and direction change
    const handleAttributeClick = (attribute) => {
        if (attribute === sortAttribute) {
            // If the same attribute is clicked again, toggle the sort direction
            setSortDirection((prevSortDirection) =>
                prevSortDirection === 'asc' ? 'desc' : 'asc'
            );
        } else {
            // If a different attribute is clicked, set the sort attribute and default to ascending order
            setSortAttribute(attribute);
            setSortDirection('asc');
        }
    };

    // Sort the filtered data based on the sort attribute and direction
    const sortedData = filteredData.sort((a, b) => {
        if (sortAttribute === 'profit') {

            return sortDirection === 'asc'
                ? a.C_total_profit - b.C_total_profit
                : b.C_total_profit - a.C_total_profit;
        }
        // Add additional sort options for other attributes here
        else if (sortAttribute === 'name') {
            const nameA = a.fname.toLowerCase();
            const nameB = b.fname.toLowerCase();
            if (nameA < nameB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (nameA > nameB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        }
        else if (sortAttribute === 'username') {
            const nameA = a.username.toLowerCase();
            const nameB = b.username.toLowerCase();
            if (nameA < nameB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (nameA > nameB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        }
        else if (sortAttribute === 'rank') {
            return sortDirection === 'asc'
                ? a.rank - b.rank
                : b.rank - a.rank;
        }
        return 0;
    });

    // Get the data for the current page
    const currentData = sortedData.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle search term change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header ">
                    <h4 className="fw-bold m-0">All Users </h4>
                </div>
                <div className="card-body">
                    {/* {data.apidata != undefined ? <ApiData apidata={data.apidata} /> : null} */}

                    <div className="col text-center">
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="form-control"
                                style={{
                                    "width": "50%",
                                    "margin": "17px auto"
                                }}
                            />
                            {/* Pagination */}
                            {Array.from({ length: Math.ceil(filteredData.length / 30) }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`btn btn-outline-primary ${currentPage === index + 1 ? 'fw-bold' : ''}`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                        </div>
                        <div className="col text-center" style={{
                            backgroundColor: 'rgb(244 243 243)',
                            padding: '0%',
                            color: 'rgb(0, 0, 0)',
                            marginRight: '-10px',
                            marginTop: '0px',
                            borderRadius: '10px',
                            borderColor: 'rgb(0, 0, 0)'
                        }}>
                            <div className="table-responsive table-wrapper-scroll-y my-custom-scrollbar" style={{
                                padding: '14px 2px',
                                marginBottom: '40px'
                            }}>
                                <table className="table" id="example" width="100%">
                                    <thead>
                                        <tr>
                                            <th className="text-center">
                                                <button
                                                    onClick={() => handleAttributeClick('rank')}
                                                    className="btn btn-link table-header-button"
                                                >
                                                    Rank
                                                </button>
                                            </th>

                                            <th className="one">
                                                <button
                                                    onClick={() => handleAttributeClick('username')}
                                                    className="btn btn-link table-header-button"
                                                >
                                                    Username
                                                </button>
                                            </th>
                                            <th>
                                                <button
                                                    onClick={() => handleAttributeClick('name')}
                                                    className="btn btn-link table-header-button"
                                                >
                                                    Name
                                                </button>
                                            </th>


                                            <th>
                                                <button
                                                    onClick={() => handleAttributeClick('profit')}
                                                    className="btn btn-link table-header-button"
                                                >
                                                    Total gained<br /> profit
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody">
                                        {filteredData.map((user, index) => {
                                            if (username == user.username)
                                                return (<tr className="text" style={{background : "#8dfaab"}} key={index}>
                                                    <td style={{ width: '10px' }} id={`coinrank${index + 1}`}>{index + 1}</td>
                                                    <td style={{ width: '10px' }} id={`coinrank${index + 1}`}>{user.username}</td>
                                                    <td className="one" id={`coinid${index + 1}`} style={{ width: '10px' }}>{user.fname} {user.lname}</td>
                                                    {/* <td id={`coinprice${index + 1}`} style={{ width: '10px' }}>{user.C_portfolio_total_profit}</td> */}
                                                    <td id={`coinpercent${index + 1}`} style={{ width: '10px' }}>{user.C_total_profit.toFixed(2)}</td>
                                                </tr>)

                                            return (
                                                <tr className="text" key={index}>
                                                    <td style={{ width: '10px' }} id={`coinrank${index + 1}`}>{index + 1}</td>
                                                    <td style={{ width: '10px' }} id={`coinrank${index + 1}`}>{user.username}</td>
                                                    <td className="one" id={`coinid${index + 1}`} style={{ width: '10px' }}>{user.fname} {user.lname}</td>
                                                    {/* <td id={`coinprice${index + 1}`} style={{ width: '10px' }}>{user.C_portfolio_total_profit}</td> */}
                                                    <td id={`coinpercent${index + 1}`} style={{ width: '10px' }}>{user.C_total_profit.toFixed(2)}</td>
                                                </tr>

                                            );

                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                    <div>
                    </div >
                </div >
            </div >

        </>
    )
}

export default AllUsers


