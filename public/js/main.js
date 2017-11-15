$(document).ready(function(){
    $('.delete-item').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/item/' + id,
            success: function(response){
                alert('deleting item');
                window.location.href='/';
            },
                error : function(err){
                    console.log(err);
                }
        })
    });
});