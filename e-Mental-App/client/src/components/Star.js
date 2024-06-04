import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";
import styled from "styled-components";

const Star = ({ stars, rated }) => {
    const ratingStar = Array.from({ length: 5 }, (elem, index) => {
        const number = index + 0.5;

        return (
            <span key={index}>
                {stars >= index + 1 ? (
                    <FaStar className="icon" />
                ) : stars >= number ? (
                    <FaStarHalfAlt className="icon" />
                ) : (
                    <AiOutlineStar className="icon" />
                )}
            </span>
        );
    });
    return (
        <Wrapper>
            <div className="icon-style">
                {ratingStar}
                <p>({rated} reviews)</p>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    .icon-style {
        display: flex;
        gap: 0.1rem;
        margin-left: 0.5rem;
        align-items: center;
        justify-content: center;

        .icon {
            font-size: 1.2rem;
            color: orange;
        }

        .empty-icon {
            font-size: 2rem;
        }

        p {
            margin: 0;
            padding-left: 5px;
        }
    }
`;

export default Star;
