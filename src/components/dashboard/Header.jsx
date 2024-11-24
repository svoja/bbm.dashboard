import React from 'react'

const Header = ({ data }) => {
    // Extract the start and end dates from the data
    const startDate = data?.data?.events?.[0]?.date;
    const endDate = data?.data?.events?.[data.data.events.length - 1]?.date;
  
    return (
      <header className="mb-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold">BAANBAIMAI DASHBOARD</h2>
          <p className="text-blue-500">Made by Phanu</p>
          {startDate && endDate && (
            <p className="text-gray-500 text-sm mt-3">
              ข้อมูลจากวันที่ {startDate} ถึง {endDate}
            </p>
          )}
        </div>
      </header>
    );
};
  
export default Header;