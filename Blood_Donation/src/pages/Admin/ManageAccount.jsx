// Tag: for different colors of the boolean "enabled"
// fetchAccounts: THE async thunk used to fetch API data
import { Table, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts } from "../../redux/features/accountSlice";
import { useEffect } from "react";

function AccountTable() {
  const dispatch = useDispatch();
  // B1: declare the "state" var, assign it with state.accounts (the slice state), which returned by useSelector()
  // B2: assign the "state" var to the 3 vars (accounts, loading, error) and use it through out this file

  // note: "data: accounts" mean take the "data" property from accounts slice and assign it to a new var called "accounts"
  // this is just for clarity
  const { data: accounts, loading, error} = useSelector((state) => state.account);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);


  // Columns of the displayed table
  // title: the header text display on the web
  // dataIndex: the key (field)'s name that the API return, specify the exact name to get the value
  // key: used internally by Reac
  const columns = [
    {
      title: "User ID",
      dataIndex: "userID",
      key: "userID",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      key: "enabled",
      render: (enabled) => enabled ? (
        <Tag color="green">Yes</Tag>
      ) : 
      ( 
        <Tag color="red">No</Tag>
      ),
    },
  ];

  // Loading and error state of the async thunk from redux
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Actual table return
  return <Table dataSource={accounts} columns={columns} />;
}

export default AccountTable;
