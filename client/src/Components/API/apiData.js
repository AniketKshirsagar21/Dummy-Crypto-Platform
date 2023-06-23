import React from 'react'
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
function ApiData(props) {

    const api_coin_data = props.data.apidata;
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
    const filteredData = api_coin_data.filter((post) =>
        post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.symbol.toLowerCase().includes(searchTerm.toLowerCase())
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
        if (sortAttribute === 'currentPrice') {
            return sortDirection === 'asc'
                ? a.currentPrice - b.currentPrice
                : b.currentPrice - a.currentPrice;
        }
        // Add additional sort options for other attributes here
        else if (sortAttribute === 'name') {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (nameA > nameB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        }
        else if (sortAttribute === 'symbol') {
            const symbolA = a.symbol.toLowerCase();
            const symbolB = b.symbol.toLowerCase();
            if (symbolA < symbolB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (symbolA > symbolB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        }
        else if (sortAttribute === 'percent') {
            return sortDirection === 'asc'
                ? a.percent - b.percent
                : b.percent - a.percent;
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
        {/* <Helmet>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.20/js/jquery.dataTables.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.20/js/dataTables.bootstrap4.min.js"></script>
      </Helmet> */}
            <div className="card shadow mb-4">
                <div className="card-header ">
                    <h4 className="fw-bold m-0">Crypto Market </h4>
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
                        <div className='table-responsive  my-custom-scrollbar'>

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
                                        <th className="text-center">
                                            <button
                                                className="btn btn-link table-header-button"
                                            >
                                                Logo
                                            </button>
                                        </th>
                                        <th className="one">
                                            <button
                                                onClick={() => handleAttributeClick('symbol')}
                                                className="btn btn-link table-header-button"
                                            >
                                                ID
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
                                                onClick={() => handleAttributeClick('currentPrice')}
                                                className="btn btn-link table-header-button"
                                            >
                                                Current Price
                                            </button>
                                        </th>
                                        <th>
                                            <button
                                                onClick={() => handleAttributeClick('percent')}
                                                className="btn btn-link table-header-button"
                                            >
                                                24hr Change
                                            </button>
                                        </th>
                                        <th>Buy</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody">
                                    {currentData.map((post) => (
                                        <tr

                                            className="text"
                                            style={{ color: post.percent > 0 ? 'green' : 'red' }}
                                        >
                                            <td >{post.rank}</td>
                                            <td >

                                                <img
                                                    style={{ width: "40px" }}
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                    }}
                                                    src={post.coinImg}
                                                    alt="Logo"
                                                    className="coin-logo"
                                                />
                                            </td>
                                            <td className="one" id={`${post.symbol}-coinid1`}>
                                                {post.symbol}
                                            </td>
                                            <td id={`${post.symbol}-coinname1`}>{post.name}</td>
                                            <td id={`${post.symbol}-coinprice1`}>{post.currentPrice}</td>
                                            <td id={`${post.symbol}-coinpercent1`}>{post.percent}</td>
                                            <td>
                                                {username == "--" ?
                                                    <Button style={{ backgroundColor: 'black' }} value={post.idx}>
                                                        <Link to={"/Login"}>Buy</Link>
                                                    </Button>
                                                    :
                                                    <Button style={{ backgroundColor: 'black' }} value={post.idx}>
                                                        <Link to={{ pathname: `/buyCoin/${post.symbol}` }}>Buy</Link>
                                                    </Button>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div>

                    </div >
                </div >
            </div >

        </>
    )
}

export default ApiData


