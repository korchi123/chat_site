import { Pagination } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';

export const PaginationControls = observer(({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const renderPaginationItems = () => {
    const items = [];

    // Всегда показываем первую страницу
    items.push(
      <Pagination.Item 
        key={1} 
        active={1 === currentPage}
        onClick={() => onPageChange(1)}
      >
        1
      </Pagination.Item>
    );

    // Показываем многоточие, если текущая страница далеко от начала
    if (currentPage > 4) {
      items.push(<Pagination.Ellipsis key="start-ellipsis" />);
    }

    // Показываем страницы вокруг текущей
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage}
          onClick={() => onPageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    // Показываем многоточие, если текущая страница далеко от конца
    if (currentPage < totalPages - 3) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" />);
    }

    // Всегда показываем последнюю страницу, если она не первая
    if (totalPages > 1) {
      items.push(
        <Pagination.Item 
          key={totalPages} 
          active={totalPages === currentPage}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <Pagination className="justify-content-center mt-4">
      <Pagination.Prev 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {renderPaginationItems()}
      <Pagination.Next 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </Pagination>
  );
});