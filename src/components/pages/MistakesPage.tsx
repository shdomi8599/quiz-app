import { styled } from "styled-components";
import { Carousel } from "antd";

const MistakesPage = () => {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };
  return (
    <CarouselBox afterChange={onChange}>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
    </CarouselBox>
  );
};

export default MistakesPage;

const CarouselBox = styled(Carousel)`
  padding: 64px calc((100% - 960px) / 2);

  .slick-dots {
    li {
      width: 100px;
      background-color: ${({ theme }) => theme.colors.sub};
    }
    .slick-active {
      width: 100px !important;
      > button {
        background-color: ${({ theme }) => theme.colors.main} !important;
      }
    }
  }
`;
