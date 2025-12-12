import React from 'react';
import { Button } from 'reactstrap';

const SubmitBtn = ({
                       label = "Submit",
                       color = "primary",
                       disabled = false,
                       onClick,
                       className = "",
                       ...rest
                   }) => {
    return (
        <Button
            type="submit"
            color={color}
            disabled={disabled}
            onClick={onClick}
            className={className}
            {...rest}
        >
            {label}
        </Button>
    );
};

export default SubmitBtn;
