import React from "react";
import { Button } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { trigger } from "../../redux/authenticationSlice";

const Meditation = () => {
  const triggerValue = useSelector((state) => state.authentication.value);
  const dispatch = useDispatch();
  const handleClick = () => {
    console.log("handleClick");
    dispatch(trigger(triggerValue));
  };
  return (
    <div>
      <Button onClick={handleClick}>Hello World</Button>
    </div>
  );
};

export default Meditation;
